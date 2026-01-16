# whyAIrecommend - Product Requirements Document

## What's Been Implemented (Jan 2026)

### Core Features
- ✅ Premium landing page (antimetal.com-inspired)
- ✅ Step-by-step conversational audit form
- ✅ Animated scan progress page
- ✅ Pricing page with 3 tiers (Free, Pro $49/mo, Enterprise)
- ✅ PDF Export for reports
- ✅ Share to Twitter functionality
- ✅ Dashboard with trend charts

### Enhanced Audit Report System
- ✅ **Model-Specific Analysis**: Separate analysis for ChatGPT, Gemini, Perplexity
  - Explainability Score (0-100) with color-coded progress bars
  - Dominant signals per model
  - Per-model recommendation status
- ✅ **7-Day Actionable Improvement Plan**: Exactly 5 actions
  - Categories: Category Clarification, Language Simplification, Comparison Presence, Single-Paragraph Product Summary, Authority / Use-Case Signal
  - Each action includes: title, what_to_do, why_it_matters, where_ai_picks_signal, expected_impact
- ✅ **Expected AI Behavior After 7 Days**: Probabilistic predictions
- ✅ **Per-Model Impact Forecast**: What will/won't change for each AI model
- ✅ **Validation System**: Signals to check, success/failure criteria, next steps

## Tech Stack
- **Frontend**: React, Framer Motion, Recharts, html2pdf.js, Tailwind CSS
- **Backend**: FastAPI, emergentintegrations (OpenAI GPT-5.2)
- **Database**: MongoDB

## API Response Structure
```json
{
  "model_analyses": [...],
  "action_plan": [...],
  "expected_behavior_after_7_days": "...",
  "impact_forecasts": [...],
  "validation_signals": [...],
  "success_criteria": "...",
  "failure_criteria": "...",
  "next_steps_if_no_improvement": "..."
}
```

## Next Action Items
1. Implement Stripe payment integration
2. Build user authentication system  
3. Add email notifications for monthly re-audits
