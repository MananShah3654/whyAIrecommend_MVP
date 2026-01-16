import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { 
  ArrowLeft, Check, X, RotateCcw, FileText, ArrowRight, Sparkles, 
  Twitter, Download, Loader2, Target, Zap, Brain, BarChart3,
  Calendar, CheckCircle2, XCircle, AlertTriangle, RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import html2pdf from "html2pdf.js";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categoryIcons = {
  "Category Clarification": Target,
  "Language Simplification": Zap,
  "Comparison Presence": BarChart3,
  "Single-Paragraph Product Summary": FileText,
  "Authority / Use-Case Signal": Brain
};

const modelColors = {
  "ChatGPT": { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" },
  "Gemini": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
  "Perplexity": { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" }
};

export default function AuditReport() {
  const { auditId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(location.state?.auditResult || null);
  const [loading, setLoading] = useState(!audit);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef(null);

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

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    toast.info("Generating PDF...");
    try {
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${audit.product_name}-ai-audit-report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0a0a0a' },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(reportRef.current).save();
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  const handleShareTwitter = () => {
    const status = audit.is_recommended 
      ? `AI tools ARE recommending ${audit.product_name}! 🎉`
      : `Just ran an AI recommendation audit for ${audit.product_name} — got actionable insights!`;
    const tweetText = `${status}\n\nRun your own free audit:`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}&hashtags=AImarketing,SaaS`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!audit) return null;

  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <button data-testid="back-btn" onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">New Audit</span>
          </button>
          <div className="flex items-center gap-3">
            <Button data-testid="share-twitter-btn" onClick={handleShareTwitter} variant="outline" size="sm" className="rounded-full gap-2">
              <Twitter className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button data-testid="export-pdf-btn" onClick={handleExportPDF} disabled={exporting} size="sm" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Report Content */}
      <div ref={reportRef} className="px-6 md:px-12 py-12 md:py-16 bg-background">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Product Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">W</span>
              </div>
              <span className="font-mono text-sm text-muted-foreground">whyAIrecommend Report</span>
            </div>
            <h1 data-testid="report-product-name" className="font-heading text-4xl md:text-5xl font-semibold tracking-tight">{audit.product_name}</h1>
            <p className="text-xl text-muted-foreground">{audit.category}</p>
          </motion.div>

          {/* Overall Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} data-testid="recommendation-status-card"
            className={`p-8 md:p-10 rounded-2xl border-2 ${audit.is_recommended ? "border-accent bg-accent/5" : "border-border bg-card"}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${audit.is_recommended ? "bg-accent" : "bg-muted"}`}>
                {audit.is_recommended ? <Check className="w-8 h-8 text-accent-foreground" /> : <X className="w-8 h-8 text-muted-foreground" />}
              </div>
              <div>
                <h2 data-testid="recommendation-status-text" className="font-heading text-2xl md:text-3xl font-semibold">
                  {audit.is_recommended ? "AI is recommending your product" : "AI is not recommending your product"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {audit.is_recommended ? `Position: ${audit.recommendation_position || 'Mentioned'}` : `When users ask about "${audit.category}", your product isn't mentioned`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Model-Specific Analysis */}
          {audit.model_analyses && audit.model_analyses.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-accent" />
                <h2 data-testid="model-analysis-title" className="font-heading text-xl md:text-2xl font-semibold">Model-Specific Analysis</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {audit.model_analyses.map((model, index) => {
                  const colors = modelColors[model.model_name] || modelColors["ChatGPT"];
                  return (
                    <div key={index} data-testid={`model-card-${model.model_name}`} className={`p-6 rounded-xl border ${colors.border} bg-card`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-heading font-semibold ${colors.text}`}>{model.model_name}</h3>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${model.is_recommended ? "bg-green-500/20" : "bg-red-500/20"}`}>
                          {model.is_recommended ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Explainability Score</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full ${model.explainability_score >= 70 ? "bg-green-500" : model.explainability_score >= 40 ? "bg-yellow-500" : "bg-red-500"}`} 
                                   style={{ width: `${model.explainability_score}%` }} />
                            </div>
                            <span className={`font-mono text-sm font-bold ${getScoreColor(model.explainability_score)}`}>{model.explainability_score}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Dominant Signals</p>
                          <div className="flex flex-wrap gap-1">
                            {model.dominant_signals?.slice(0, 3).map((signal, i) => (
                              <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-muted">{signal}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{model.why_recommended_or_not}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Competitors */}
          {audit.recommended_competitors && audit.recommended_competitors.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              <h2 data-testid="competitors-section-title" className="font-heading text-xl md:text-2xl font-semibold">Who AI recommends instead</h2>
              <div className="grid gap-3">
                {audit.recommended_competitors.map((competitor, index) => (
                  <div key={index} data-testid={`competitor-item-${index}`} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <span className="font-heading font-semibold text-sm text-muted-foreground">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{competitor.name}</p>
                      <p className="text-sm text-muted-foreground">{competitor.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Explainability Grid */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <h2 className="font-heading text-lg font-semibold">Why AI recommends others</h2>
              </div>
              <ul className="space-y-3">
                {audit.why_others_recommended?.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="font-heading text-lg font-semibold">Why your product is skipped</h2>
              </div>
              <ul className="space-y-3">
                {audit.why_product_skipped?.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* 7-Day Action Plan */}
          {audit.action_plan && audit.action_plan.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} 
              className="p-6 md:p-8 rounded-2xl border-2 border-accent/20 bg-accent/5 space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-accent" />
                <div>
                  <h2 data-testid="action-plan-title" className="font-heading text-xl md:text-2xl font-semibold">7-Day Actionable Improvement Plan</h2>
                  <p className="text-sm text-muted-foreground">5 specific actions to improve AI recommendation likelihood</p>
                </div>
              </div>
              <div className="space-y-4">
                {audit.action_plan.map((action, index) => {
                  const IconComponent = categoryIcons[action.category] || Zap;
                  return (
                    <div key={index} data-testid={`action-item-${index}`} className="p-5 rounded-xl bg-background/50 border border-border">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                          <span className="font-mono text-sm font-bold text-accent-foreground">{index + 1}</span>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-heading font-semibold text-lg">{action.title}</h3>
                            <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground flex items-center gap-1 shrink-0">
                              <IconComponent className="w-3 h-3" />
                              {action.category}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground font-medium mb-1">What to do</p>
                              <p>{action.what_to_do}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium mb-1">Why it matters</p>
                              <p>{action.why_it_matters}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium mb-1">Where AI picks up signal</p>
                              <p>{action.where_ai_picks_signal}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium mb-1">Expected impact</p>
                              <p className="text-accent">{action.expected_impact}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Expected Behavior After 7 Days */}
          {audit.expected_behavior_after_7_days && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-accent" />
                <h2 data-testid="expected-behavior-title" className="font-heading text-xl md:text-2xl font-semibold">Expected AI Behavior After 7 Days</h2>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <p className="text-foreground/90 leading-relaxed">{audit.expected_behavior_after_7_days}</p>
                <p className="text-sm text-muted-foreground mt-4 italic">
                  Note: Improvements increase recommendation likelihood but do not guarantee rankings.
                </p>
              </div>
            </motion.section>
          )}

          {/* Per-Model Impact Forecast */}
          {audit.impact_forecasts && audit.impact_forecasts.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-accent" />
                <h2 data-testid="impact-forecast-title" className="font-heading text-xl md:text-2xl font-semibold">Per-Model Impact Forecast</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {audit.impact_forecasts.map((forecast, index) => {
                  const colors = modelColors[forecast.model_name] || modelColors["ChatGPT"];
                  return (
                    <div key={index} data-testid={`forecast-card-${forecast.model_name}`} className={`p-5 rounded-xl border ${colors.border} bg-card`}>
                      <h3 className={`font-heading font-semibold mb-4 ${colors.text}`}>{forecast.model_name}</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Signal Improves</p>
                          <p>{forecast.signal_improves}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1 flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Likely Changes</p>
                          <p>{forecast.likely_changes}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500" /> Won't Change Yet</p>
                          <p>{forecast.will_not_change}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Validation Section */}
          {audit.validation_signals && audit.validation_signals.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-accent" />
                <h2 data-testid="validation-title" className="font-heading text-xl md:text-2xl font-semibold">How We Will Validate Improvement</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-border bg-card space-y-3">
                  <h3 className="font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-accent" /> Signals to Check</h3>
                  <ul className="space-y-2">
                    {audit.validation_signals.map((signal, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        {signal}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5">
                    <h3 className="font-semibold flex items-center gap-2 text-green-500 mb-2"><CheckCircle2 className="w-4 h-4" /> Success Looks Like</h3>
                    <p className="text-sm">{audit.success_criteria}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                    <h3 className="font-semibold flex items-center gap-2 text-red-500 mb-2"><XCircle className="w-4 h-4" /> Failure Looks Like</h3>
                    <p className="text-sm">{audit.failure_criteria}</p>
                  </div>
                </div>
              </div>
              {audit.next_steps_if_no_improvement && (
                <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
                  <h3 className="font-semibold flex items-center gap-2 text-yellow-500 mb-2"><AlertTriangle className="w-4 h-4" /> If No Improvement</h3>
                  <p className="text-sm">{audit.next_steps_if_no_improvement}</p>
                </div>
              )}
            </motion.section>
          )}
        </div>
      </div>

      {/* Actions Section */}
      <div className="px-6 md:px-12 pb-12">
        <div className="max-w-5xl mx-auto">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-lg font-semibold">Ready to track your progress?</h3>
              <p className="text-muted-foreground text-sm">Run another audit after implementing changes to measure improvement.</p>
            </div>
            <div className="flex gap-3">
              <Button data-testid="share-twitter-btn-2" onClick={handleShareTwitter} className="rounded-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white gap-2">
                <Twitter className="h-4 w-4" /> Share Results
              </Button>
              <Button data-testid="rerun-audit-btn" onClick={() => navigate("/audit")} variant="outline" className="rounded-full gap-2">
                <RotateCcw className="h-4 w-4" /> Re-scan
              </Button>
            </div>
          </motion.section>
        </div>
      </div>

      <footer className="py-8 px-6 md:px-12 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-sm text-muted-foreground">whyAIrecommend — AI Recommendation Diagnostics</p>
        </div>
      </footer>
    </main>
  );
}
