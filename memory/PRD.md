# whyAIrecommend - Product Requirements Document

## Original Problem Statement
Build a production-ready MVP web application called whyAIrecommend - an AI Recommendation Diagnostic & Explainability tool that helps SaaS founders understand:
- Whether AI tools (like ChatGPT) recommend their product
- Which competitors AI prefers instead
- WHY those recommendations happen
- What clarity issues prevent AI from recommending them

Visual inspiration from antimetal.com - minimalist, high whitespace, neutral colors, typography-first design.

## User Persona
**Primary**: SaaS founders who want to understand AI recommendation behavior and improve their product's discoverability in AI-powered search/recommendations.

## Core Requirements (Static)
1. Landing Page with single CTA "Run Free Audit"
2. 60-second Audit Input Form (Product Name, URL, Category, Competitors)
3. Scan Progress page with animated steps
4. Audit Report showing: AI Recommendation Status, Competitors, Explainability Breakdown, Improvements
5. Upgrade CTA section
6. OpenAI GPT-5.2 integration for AI analysis

## What's Been Implemented (Jan 2026)
- ✅ Landing page with hero, headline, subheadline, CTA
- ✅ Audit input form with 4 fields + competitor tags
- ✅ Scan progress page with framer-motion animations
- ✅ Comprehensive audit report with all sections
- ✅ Backend API with `/api/run-audit` endpoint
- ✅ OpenAI GPT-5.2 integration via Emergent LLM key
- ✅ MongoDB storage for audits
- ✅ Dark theme with neon lime (#CCFF00) accent
- ✅ Typography: Outfit (headings), Inter (body), JetBrains Mono (mono)

## Tech Stack
- **Frontend**: React, React Router, Framer Motion, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI, emergentintegrations (OpenAI GPT-5.2)
- **Database**: MongoDB

## Prioritized Backlog

### P0 (Critical) - Completed
- [x] Full audit flow from landing to report
- [x] AI integration for product analysis

### P1 (High Priority)
- [ ] PDF export functionality
- [ ] Monthly re-audit tracking
- [ ] User authentication for premium features
- [ ] Deep competitor comparison mode

### P2 (Medium Priority)
- [ ] Historical audit comparison
- [ ] Webhook/API access for enterprise
- [ ] White-label options
- [ ] Custom category training

## Next Action Items
1. Implement PDF export for audit reports
2. Add Stripe integration for premium features
3. Build user authentication system
4. Create email notification for monthly re-audits
