import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft, Check, X, RotateCcw, Users, FileText, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AuditReport() {
  const { auditId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(location.state?.auditResult || null);
  const [loading, setLoading] = useState(!audit);

  useEffect(() => {
    if (!audit && auditId) {
      const fetchAudit = async () => {
        try {
          const response = await axios.get(`${API}/audit/${auditId}`);
          setAudit(response.data);
        } catch (error) {
          console.error("Failed to fetch audit:", error);
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      fetchAudit();
    }
  }, [auditId, audit, navigate]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!audit) return null;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <button
            data-testid="back-btn"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">New Audit</span>
          </button>
          <div className="flex items-center gap-3">
            <Button
              data-testid="upgrade-nav-btn"
              onClick={() => navigate("/pricing")}
              size="sm"
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Upgrade
            </Button>
          </div>
        </div>
      </header>

      <div className="px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Product Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
              Audit Report
            </p>
            <h1 
              data-testid="report-product-name"
              className="font-heading text-4xl md:text-6xl font-semibold tracking-tight"
            >
              {audit.product_name}
            </h1>
            <p className="text-xl text-muted-foreground">{audit.category}</p>
          </motion.div>

          {/* Main Result Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            data-testid="recommendation-status-card"
            className={`p-8 md:p-12 rounded-2xl border-2 ${
              audit.is_recommended 
                ? "border-accent bg-accent/5 glow-sm" 
                : "border-border bg-card"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${
                audit.is_recommended ? "bg-accent" : "bg-muted"
              }`}>
                {audit.is_recommended ? (
                  <Check className="w-10 h-10 text-accent-foreground" />
                ) : (
                  <X className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <h2 
                  data-testid="recommendation-status-text"
                  className="font-heading text-2xl md:text-4xl font-semibold"
                >
                  {audit.is_recommended 
                    ? "AI is recommending your product" 
                    : "AI is not recommending your product"}
                </h2>
                {audit.is_recommended && audit.recommendation_position && (
                  <p className="text-muted-foreground">
                    Appearing in the <span className="text-accent font-medium">{audit.recommendation_position}</span> position of recommendations
                  </p>
                )}
                {!audit.is_recommended && (
                  <p className="text-muted-foreground">
                    When users ask about "{audit.category}", your product isn't mentioned
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Competitors Section */}
          {audit.recommended_competitors && audit.recommended_competitors.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <h2 
                  data-testid="competitors-section-title"
                  className="font-heading text-xl md:text-2xl font-semibold"
                >
                  Who AI recommends instead
                </h2>
              </div>
              <div className="grid gap-4">
                {audit.recommended_competitors.map((competitor, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    data-testid={`competitor-item-${index}`}
                    className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-border/80 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <span className="font-heading font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{competitor.name}</p>
                      <p className="text-muted-foreground">{competitor.reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Explainability Grid */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Why Others */}
            <div className="p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-accent" />
                </div>
                <h2 
                  data-testid="why-others-title"
                  className="font-heading text-lg md:text-xl font-semibold"
                >
                  Why AI recommends others
                </h2>
              </div>
              <ul className="space-y-4">
                {audit.why_others_recommended?.map((reason, index) => (
                  <li 
                    key={index}
                    data-testid={`why-others-item-${index}`}
                    className="flex items-start gap-3"
                  >
                    <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Skipped */}
            <div className="p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <X className="w-5 h-5 text-muted-foreground" />
                </div>
                <h2 
                  data-testid="why-skipped-title"
                  className="font-heading text-lg md:text-xl font-semibold"
                >
                  Why your product is skipped
                </h2>
              </div>
              <ul className="space-y-4">
                {audit.why_product_skipped?.map((reason, index) => (
                  <li 
                    key={index}
                    data-testid={`why-skipped-item-${index}`}
                    className="flex items-start gap-3"
                  >
                    <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Improvements Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 md:p-10 rounded-2xl border-2 border-accent/20 bg-accent/5 space-y-6"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-accent" />
              <h2 
                data-testid="improvements-title"
                className="font-heading text-xl md:text-2xl font-semibold"
              >
                What you can improve
              </h2>
            </div>
            <div className="grid gap-4">
              {audit.improvements?.map((improvement, index) => (
                <div 
                  key={index}
                  data-testid={`improvement-item-${index}`}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <span className="font-mono text-sm font-bold text-accent-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-foreground pt-1">{improvement}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Upgrade CTA */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            data-testid="upgrade-cta-section"
            className="py-12 border-t border-border/50 space-y-8"
          >
            <div className="space-y-4">
              <h2 className="font-heading text-2xl md:text-4xl font-semibold">
                Want deeper insights?
              </h2>
              <p className="text-xl text-muted-foreground max-w-xl">
                Track your AI visibility over time, compare unlimited competitors, and export professional reports.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                data-testid="view-plans-btn"
                onClick={() => navigate("/pricing")}
                size="lg"
                className="h-14 px-8 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 group"
              >
                View Plans
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                data-testid="rerun-audit-btn"
                onClick={() => navigate("/audit")}
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-full"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Run Another Audit
              </Button>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="font-mono text-sm text-muted-foreground">
            whyAIrecommend
          </p>
        </div>
      </footer>
    </main>
  );
}
