# whyAIrecommend - Product Requirements Document

## What's Been Implemented (Feb 2026)

### Core Features
- ✅ Premium landing page (antimetal.com-inspired)
- ✅ Step-by-step conversational audit form
- ✅ Animated scan progress page  
- ✅ Pricing page with 3 tiers (Free, Pro $49/mo, Enterprise)
- ✅ PDF Export for reports
- ✅ Share to Twitter functionality
- ✅ Dashboard with trend charts

### Enhanced Audit Report - Task-Based UX
- ✅ **Execution Confidence Meter** - Score at top showing action feasibility
- ✅ **7-Day AI Visibility Sprint Timeline** - 5-day progress tracker with checkboxes
- ✅ **Task Cards** with:
  - Owner badge (Product/Marketing/Engineering)
  - Location badge (Homepage/About/Pricing)
  - Effort badge (15-30 mins / 30-45 mins / 1-2 hours)
  - Day Range badge (Day 1-2 through Day 6-7)
  - Mark as Done checkbox with strikethrough
  - Model improvement tags (🤖 ChatGPT, 🧠 Gemini, 🔍 Perplexity)
- ✅ **Expandable Task Details**:
  - What to do instructions
  - AI-Optimized Copy with Copy button
  - Before → After AI explanation preview
  - Why it matters
- ✅ **7-Day AI Checkpoint Section**:
  - Validation signals
  - Success criteria (green)
  - Failure criteria (red)
  - Schedule AI Checkpoint button
- ✅ **Per-Model Impact Forecast** - What will/won't change per AI model

### Model-Specific Analysis
- ✅ ChatGPT, Gemini, Perplexity individual cards
- ✅ Explainability Score (0-100) with color-coded bars
- ✅ Dominant signals per model
- ✅ Per-model recommendation status

## Tech Stack
- **Frontend**: React, Framer Motion, Recharts, html2pdf.js, Tailwind CSS
- **Backend**: FastAPI, emergentintegrations (OpenAI GPT-5.2)
- **Database**: MongoDB

## API Response Structure (New Fields)
```json
{
  "execution_confidence": 72,
  "confidence_factors": [...],
  "action_plan": [
    {
      "title": "...",
      "owner": "Product",
      "location": "Homepage",
      "effort": "30-45 mins",
      "day_range": "Day 1-2",
      "suggested_copy": "AI-optimized text to paste",
      "before_explanation": "How AI explains now",
      "after_explanation": "How AI will explain after",
      "improves_models": ["ChatGPT", "Gemini", "Perplexity"]
    }
  ]
}
```

## Next Action Items
1. Implement Stripe payment integration
2. Build user authentication system
3. Add email notifications for monthly re-audits
4. Test new audits to verify suggested_copy generation
