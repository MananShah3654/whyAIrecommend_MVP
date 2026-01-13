import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight, Zap, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">W</span>
            </div>
            <span className="font-heading font-semibold text-lg">whyAIrecommend</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-dashboard"
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate("/pricing")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-pricing"
            >
              Pricing
            </button>
            <Button
              data-testid="nav-get-started"
              onClick={() => navigate("/audit")}
              size="sm"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 md:px-12">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
              <Zap className="w-4 h-4" />
              AI Recommendation Intelligence
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            data-testid="hero-headline"
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] mb-8"
          >
            Is AI recommending
            <br />
            <span className="text-muted-foreground">your product?</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            data-testid="hero-subheadline"
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-12"
          >
            Discover how ChatGPT, Claude, and other AI tools perceive and recommend your SaaS. 
            Get actionable insights in 2 minutes.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
            <Button
              data-testid="run-free-audit-btn"
              onClick={() => navigate("/audit")}
              size="lg"
              className="h-14 px-8 text-lg font-medium rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all glow-sm group"
            >
              Run Free Audit
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              data-testid="view-pricing-btn"
              onClick={() => navigate("/pricing")}
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg font-medium rounded-full border-border/50 hover:bg-muted"
            >
              View Pricing
            </Button>
          </motion.div>
          
          <motion.p 
            variants={fadeInUp}
            data-testid="trust-line"
            className="mt-6 text-sm text-muted-foreground/70 font-mono"
          >
            No signup required · No credit card · Results in 2 minutes
          </motion.p>
        </motion.div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 md:py-32 px-6 md:px-12 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="font-mono text-sm text-accent uppercase tracking-widest">The Problem</p>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
              When buyers ask AI for recommendations,
              <br />
              <span className="text-muted-foreground">is your product in the answer?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Every day, millions of people ask ChatGPT "What's the best tool for X?" 
              If AI doesn't understand your positioning, you're invisible to a growing segment of buyers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="font-mono text-sm text-accent uppercase tracking-widest mb-4">What You Get</p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight">
              Complete AI visibility report
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Recommendation Status",
                description: "See if AI tools actually recommend your product when asked about your category."
              },
              {
                icon: TrendingUp,
                title: "Competitor Analysis",
                description: "Discover which competitors AI prefers and understand exactly why."
              },
              {
                icon: CheckCircle2,
                title: "Actionable Fixes",
                description: "Get specific improvements to boost your AI recommendation chances."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-colors group"
                data-testid={`feature-card-${index}`}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 md:py-32 px-6 md:px-12 border-t border-border/50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex justify-center gap-8 text-muted-foreground">
              <div className="text-center">
                <p className="font-heading text-4xl md:text-5xl font-bold text-foreground">2,500+</p>
                <p className="text-sm mt-1">Audits Run</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="font-heading text-4xl md:text-5xl font-bold text-foreground">89%</p>
                <p className="text-sm mt-1">Improve Visibility</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="font-heading text-4xl md:text-5xl font-bold text-foreground">2min</p>
                <p className="text-sm mt-1">Average Audit Time</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            Ready to see where you stand?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Run your first audit for free. No signup, no credit card.
          </p>
          <Button
            data-testid="cta-run-audit"
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
            AI Recommendation Diagnostics for SaaS
          </p>
        </div>
      </footer>
    </main>
  );
}
