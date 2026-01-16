from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json
import re

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class AuditRequest(BaseModel):
    product_name: str
    website_url: str
    category: str
    competitors: Optional[List[str]] = []

class CompetitorAnalysis(BaseModel):
    name: str
    reason: str

class ExplainabilityItem(BaseModel):
    text: str
    positive: bool

class ActionItem(BaseModel):
    title: str
    what_to_do: str
    why_it_matters: str
    where_ai_picks_signal: str
    expected_impact: str
    category: str

class ModelAnalysis(BaseModel):
    model_name: str
    is_recommended: bool
    recommendation_position: Optional[str] = None
    explainability_score: int  # 0-100
    dominant_signals: List[str]
    why_recommended_or_not: str

class ImpactForecast(BaseModel):
    model_name: str
    signal_improves: str
    likely_changes: str
    will_not_change: str

class AuditResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_name: str
    website_url: str
    category: str
    competitors_input: List[str]
    
    # Overall status
    is_recommended: bool
    recommendation_position: Optional[str] = None
    
    # Model-specific analysis
    model_analyses: List[ModelAnalysis] = []
    
    # Competitors
    recommended_competitors: List[CompetitorAnalysis]
    
    # Explainability
    why_others_recommended: List[str]
    why_product_skipped: List[str]
    
    # 5-step action plan
    action_plan: List[ActionItem] = []
    
    # 7-day impact simulation
    expected_behavior_after_7_days: str = ""
    
    # Re-scan validation
    validation_signals: List[str] = []
    success_criteria: str = ""
    failure_criteria: str = ""
    next_steps_if_no_improvement: str = ""
    
    # Per-model impact forecast
    impact_forecasts: List[ImpactForecast] = []
    
    # Legacy fields
    improvements: List[str] = []
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== AI AUDIT LOGIC ====================

async def run_ai_audit(request: AuditRequest) -> AuditResult:
    """Run the AI recommendation audit using OpenAI GPT-5.2"""
    
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    competitors_str = ", ".join(request.competitors) if request.competitors else "unknown competitors"
    
    system_message = """You are an expert AI recommendation analyst. You analyze how AI assistants (ChatGPT, Gemini, Perplexity) recommend software products.
    Your analysis must be specific, actionable, and tied to AI explainability signals.
    Always respond with valid JSON only, no markdown or explanations."""
    
    user_prompt = f"""Analyze how AI tools would recommend products in this category:

Product: {request.product_name}
Website: {request.website_url}
Category: {request.category}
Known Competitors: {competitors_str}

Simulate how ChatGPT, Gemini, and Perplexity would respond to: "What's the best {request.category} tool?"

Provide your analysis as JSON with this EXACT structure:
{{
    "is_recommended": boolean,
    "recommendation_position": "top" | "middle" | "mentioned" | null,
    
    "model_analyses": [
        {{
            "model_name": "ChatGPT",
            "is_recommended": boolean,
            "recommendation_position": "top" | "middle" | "mentioned" | null,
            "explainability_score": 0-100,
            "dominant_signals": ["signal1", "signal2", "signal3"],
            "why_recommended_or_not": "specific reason"
        }},
        {{
            "model_name": "Gemini",
            "is_recommended": boolean,
            "recommendation_position": "top" | "middle" | "mentioned" | null,
            "explainability_score": 0-100,
            "dominant_signals": ["signal1", "signal2", "signal3"],
            "why_recommended_or_not": "specific reason"
        }},
        {{
            "model_name": "Perplexity",
            "is_recommended": boolean,
            "recommendation_position": "top" | "middle" | "mentioned" | null,
            "explainability_score": 0-100,
            "dominant_signals": ["signal1", "signal2", "signal3"],
            "why_recommended_or_not": "specific reason"
        }}
    ],
    
    "recommended_competitors": [
        {{"name": "CompetitorName", "reason": "Why AI recommends them"}}
    ],
    
    "why_others_recommended": ["Reason 1", "Reason 2", "Reason 3"],
    "why_product_skipped": ["Reason 1", "Reason 2", "Reason 3"],
    
    "action_plan": [
        {{
            "title": "Clear action title",
            "what_to_do": "Specific change to make",
            "why_it_matters": "Why this affects AI recommendations",
            "where_ai_picks_signal": "Where AI will detect this signal",
            "expected_impact": "Expected result after 7 days",
            "category": "Category Clarification | Language Simplification | Comparison Presence | Single-Paragraph Product Summary | Authority / Use-Case Signal"
        }}
    ],
    
    "expected_behavior_after_7_days": "Prediction of how AI responses will change (probabilistic, not guaranteed)",
    
    "validation_signals": ["Signal 1 to check", "Signal 2 to check"],
    "success_criteria": "What success looks like in a re-scan",
    "failure_criteria": "What failure looks like",
    "next_steps_if_no_improvement": "What to do if no improvement",
    
    "impact_forecasts": [
        {{
            "model_name": "ChatGPT",
            "signal_improves": "What signal will improve",
            "likely_changes": "What will likely change",
            "will_not_change": "What won't change yet"
        }},
        {{
            "model_name": "Gemini",
            "signal_improves": "What signal will improve",
            "likely_changes": "What will likely change",
            "will_not_change": "What won't change yet"
        }},
        {{
            "model_name": "Perplexity",
            "signal_improves": "What signal will improve",
            "likely_changes": "What will likely change",
            "will_not_change": "What won't change yet"
        }}
    ]
}}

IMPORTANT RULES:
- Provide EXACTLY 5 actions in action_plan
- Actions must be executable within 7 days
- Actions must be from these categories ONLY: Category Clarification, Language Simplification, Comparison Presence, Single-Paragraph Product Summary, Authority / Use-Case Signal
- Never promise ranking improvements
- Frame improvements as "increased likelihood" not guarantees
- Each model analysis must be independent

Return ONLY valid JSON, nothing else."""

    chat = LlmChat(
        api_key=api_key,
        session_id=f"audit-{uuid.uuid4()}",
        system_message=system_message
    ).with_model("openai", "gpt-5.2")
    
    user_message = UserMessage(text=user_prompt)
    
    try:
        response = await chat.send_message(user_message)
        
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            analysis = json.loads(json_match.group())
        else:
            analysis = json.loads(response)
        
        # Build model analyses
        model_analyses = []
        for ma in analysis.get("model_analyses", []):
            model_analyses.append(ModelAnalysis(
                model_name=ma.get("model_name", "Unknown"),
                is_recommended=ma.get("is_recommended", False),
                recommendation_position=ma.get("recommendation_position"),
                explainability_score=ma.get("explainability_score", 0),
                dominant_signals=ma.get("dominant_signals", [])[:5],
                why_recommended_or_not=ma.get("why_recommended_or_not", "")
            ))
        
        # Build action plan
        action_plan = []
        for action in analysis.get("action_plan", [])[:5]:
            action_plan.append(ActionItem(
                title=action.get("title", ""),
                what_to_do=action.get("what_to_do", ""),
                why_it_matters=action.get("why_it_matters", ""),
                where_ai_picks_signal=action.get("where_ai_picks_signal", ""),
                expected_impact=action.get("expected_impact", ""),
                category=action.get("category", "")
            ))
        
        # Build impact forecasts
        impact_forecasts = []
        for forecast in analysis.get("impact_forecasts", []):
            impact_forecasts.append(ImpactForecast(
                model_name=forecast.get("model_name", ""),
                signal_improves=forecast.get("signal_improves", ""),
                likely_changes=forecast.get("likely_changes", ""),
                will_not_change=forecast.get("will_not_change", "")
            ))
        
        result = AuditResult(
            product_name=request.product_name,
            website_url=request.website_url,
            category=request.category,
            competitors_input=request.competitors or [],
            is_recommended=analysis.get("is_recommended", False),
            recommendation_position=analysis.get("recommendation_position"),
            model_analyses=model_analyses,
            recommended_competitors=[
                CompetitorAnalysis(name=c["name"], reason=c["reason"])
                for c in analysis.get("recommended_competitors", [])[:5]
            ],
            why_others_recommended=analysis.get("why_others_recommended", [])[:4],
            why_product_skipped=analysis.get("why_product_skipped", [])[:4],
            action_plan=action_plan,
            expected_behavior_after_7_days=analysis.get("expected_behavior_after_7_days", ""),
            validation_signals=analysis.get("validation_signals", [])[:5],
            success_criteria=analysis.get("success_criteria", ""),
            failure_criteria=analysis.get("failure_criteria", ""),
            next_steps_if_no_improvement=analysis.get("next_steps_if_no_improvement", ""),
            impact_forecasts=impact_forecasts,
            improvements=[a.get("title", "") for a in analysis.get("action_plan", [])[:3]]
        )
        
        return result
        
    except json.JSONDecodeError as e:
        logging.error(f"Failed to parse AI response: {e}")
        return AuditResult(
            product_name=request.product_name,
            website_url=request.website_url,
            category=request.category,
            competitors_input=request.competitors or [],
            is_recommended=False,
            recommendation_position=None,
            model_analyses=[],
            recommended_competitors=[
                CompetitorAnalysis(name="Analysis Error", reason="Could not parse AI response")
            ],
            why_others_recommended=["AI response parsing failed"],
            why_product_skipped=["Could not complete analysis"],
            action_plan=[],
            expected_behavior_after_7_days="",
            validation_signals=[],
            success_criteria="",
            failure_criteria="",
            next_steps_if_no_improvement="",
            impact_forecasts=[],
            improvements=["Try running the audit again"]
        )
    except Exception as e:
        logging.error(f"AI audit failed: {e}")
        raise HTTPException(status_code=500, detail=f"AI audit failed: {str(e)}")

# ==================== API ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "whyAIrecommend API"}

@api_router.post("/run-audit", response_model=AuditResult)
async def create_audit(request: AuditRequest):
    """Run an AI recommendation audit for a product"""
    
    # Validate required fields
    if not request.product_name or not request.product_name.strip():
        raise HTTPException(status_code=422, detail="Product name is required")
    if not request.website_url or not request.website_url.strip():
        raise HTTPException(status_code=422, detail="Website URL is required")
    if not request.category or not request.category.strip():
        raise HTTPException(status_code=422, detail="Category is required")
    
    # Run the AI audit
    result = await run_ai_audit(request)
    
    # Store in MongoDB
    doc = result.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.audits.insert_one(doc)
    
    return result

@api_router.get("/audits", response_model=List[AuditResult])
async def get_audits():
    """Get all past audits"""
    audits = await db.audits.find({}, {"_id": 0}).to_list(100)
    for audit in audits:
        if isinstance(audit.get('created_at'), str):
            audit['created_at'] = datetime.fromisoformat(audit['created_at'])
    return audits

@api_router.get("/audit/{audit_id}", response_model=AuditResult)
async def get_audit(audit_id: str):
    """Get a specific audit by ID"""
    audit = await db.audits.find_one({"id": audit_id}, {"_id": 0})
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    if isinstance(audit.get('created_at'), str):
        audit['created_at'] = datetime.fromisoformat(audit['created_at'])
    return audit

@api_router.delete("/audit/{audit_id}")
async def delete_audit(audit_id: str):
    """Delete a specific audit by ID"""
    result = await db.audits.delete_one({"id": audit_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Audit not found")
    return {"message": "Audit deleted successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
