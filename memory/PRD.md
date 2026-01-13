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
1. Landing Page with compelling copy, navigation, features section, stats, CTAs
2. Step-by-step conversational Audit Input Form (4 steps)
3. Animated Scan Progress page
4. Comprehensive Audit Report
5. Pricing page with 3 tiers (Free, Pro, Enterprise)
6. OpenAI GPT-5.2 integration for AI analysis

## What's Been Implemented (Jan 2026)
- ✅ Premium landing page with antimetal.com-inspired design
- ✅ Fixed navigation with logo, pricing link, Get Started CTA
- ✅ Hero section with badge, headline, CTAs
- ✅ Problem statement section
- ✅ Features cards (Recommendation Status, Competitor Analysis, Actionable Fixes)
- ✅ Stats section (2,500+ audits, 89% improve, 2min)
- ✅ Final CTA section
- ✅ Step-by-step conversational audit form with progress bar
- ✅ Animated scan progress page
- ✅ Comprehensive audit report with all sections
- ✅ Pricing page with 3 plans (Free, Pro $49/mo, Enterprise)
- ✅ FAQ section on pricing page
- ✅ Trust section with security, results, speed
- ✅ Backend API with `/api/run-audit` endpoint
- ✅ OpenAI GPT-5.2 integration via Emergent LLM key
- ✅ MongoDB storage for audits
- ✅ Neon lime (#CCFF00) accent with dark theme
- ✅ Typography: Outfit (headings), Inter (body), JetBrains Mono (mono)
- ✅ Framer Motion animations throughout

## Tech Stack
- **Frontend**: React, React Router, Framer Motion, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI, emergentintegrations (OpenAI GPT-5.2)
- **Database**: MongoDB

## Pricing Structure
| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 1 audit/month, basic report, top 3 competitors |
| Pro | $49/mo | Unlimited audits, deep analysis, PDF export, tracking |
| Enterprise | Custom | Multi-product, API access, white-label, dedicated support |

## Prioritized Backlog

### P0 (Critical) - Completed
- [x] Full audit flow from landing to report
- [x] AI integration for product analysis
- [x] Pricing page with plans

### P1 (High Priority)
- [ ] Stripe integration for Pro/Enterprise payments
- [ ] User authentication system
- [ ] PDF export functionality
- [ ] Historical audit tracking dashboard

### P2 (Medium Priority)
- [ ] Email notifications for monthly re-audits
- [ ] API access for Enterprise tier
- [ ] White-label options
- [ ] Team collaboration features

## Next Action Items
1. Implement Stripe payment integration
2. Build authentication system
3. Add PDF export for reports
4. Create tracking dashboard for Pro users
