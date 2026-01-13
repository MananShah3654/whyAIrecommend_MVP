import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft, Check, ArrowRight, Zap, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "",
    description: "Perfect for a quick audit",
    features: [
      "1 audit per month",
      "Basic recommendation status",
      "Top 3 competitor insights",
      "3 improvement suggestions"
    ],
    cta: "Start Free Audit",
    popular: false,
    highlight: false
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For founders serious about AI visibility",
    features: [
      "Unlimited audits",
      "Deep competitor analysis",
      "Historical tracking",
      "PDF export reports",
      "Email alerts on changes",
      "Priority support"
    ],
    cta: "Start Pro Trial",
    popular: true,
    highlight: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Multiple products",
      "API access",
      "White-label reports",
      "Dedicated account manager",
      "Custom integrations"
    ],
    cta: "Contact Sales",
    popular: false,
    highlight: false
  }
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <button
            data-testid="back-home-btn"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">W</span>
            </div>
            <span className="font-heading font-semibold">whyAIrecommend</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Simple, transparent pricing
          </span>
          <h1 
            data-testid="pricing-headline"
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6"
          >
            Choose your plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 md:pb-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-testid={`plan-card-${plan.id}`}
                className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all ${
                  plan.highlight 
                    ? "border-accent bg-accent/5 glow-sm scale-105 md:scale-110 z-10" 
                    : "border-border bg-card hover:border-border/80"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl font-semibold">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading text-4xl md:text-5xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 shrink-0 mt-0.5 ${
                          plan.highlight ? "text-accent" : "text-muted-foreground"
                        }`} />
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    data-testid={`plan-cta-${plan.id}`}
                    onClick={() => plan.id === "free" ? navigate("/audit") : null}
                    size="lg"
                    className={`w-full h-12 rounded-full font-medium ${
                      plan.highlight 
                        ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    {plan.cta}
                    {plan.id === "free" && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and never shared" },
              { icon: TrendingUp, title: "Proven Results", desc: "89% of users improve their AI visibility" },
              { icon: Zap, title: "Instant Insights", desc: "Get results in under 2 minutes" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-4xl font-semibold text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "How does the AI audit work?",
                a: "We simulate how real users ask AI tools like ChatGPT for product recommendations in your category. Then we analyze whether your product appears, where it ranks, and why."
              },
              {
                q: "What's included in the free plan?",
                a: "You get one full audit per month with recommendation status, top 3 competitor insights, and 3 actionable improvement suggestions. No signup required."
              },
              {
                q: "Can I cancel my Pro subscription anytime?",
                a: "Yes, you can cancel anytime. You'll continue to have access until the end of your billing period."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 14-day money-back guarantee. If you're not satisfied, just contact us for a full refund."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                data-testid={`faq-item-${index}`}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <h3 className="font-heading font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight mb-6">
            Ready to improve your AI visibility?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Start with a free audit. No credit card required.
          </p>
          <Button
            data-testid="final-cta-btn"
            onClick={() => navigate("/audit")}
            size="lg"
            className="h-16 px-12 text-xl font-medium rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all glow-accent group"
          >
            Start Free Audit
            <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-xs">W</span>
            </div>
            <span className="font-mono text-sm text-muted-foreground">whyAIrecommend</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 whyAIrecommend. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
