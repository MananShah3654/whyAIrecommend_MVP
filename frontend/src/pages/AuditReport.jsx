import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { 
  ArrowLeft, Check, X, RotateCcw, FileText, ArrowRight, Sparkles, 
  Twitter, Download, Loader2, Target, Zap, Brain, BarChart3,
  Calendar, CheckCircle2, XCircle, AlertTriangle, RefreshCw,
  Copy, ChevronDown, ChevronUp, Clock, MapPin, User, Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  "ChatGPT": { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30", icon: "🤖" },
  "Gemini": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30", icon: "🧠" },
  "Perplexity": { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30", icon: "🔍" }
};

const timelineDays = [
  { range: "Day 1-2", label: "Category Clarity", category: "Category Clarification" },
  { range: "Day 3", label: "Product Summary", category: "Single-Paragraph Product Summary" },
  { range: "Day 4", label: "Comparison Page", category: "Comparison Presence" },
  { range: "Day 5", label: "Language Simplification", category: "Language Simplification" },
  { range: "Day 6-7", label: "Authority Signals", category: "Authority / Use-Case Signal" }
];

export default function AuditReport() {
  const { auditId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(location.state?.auditResult || null);
  const [loading, setLoading] = useState(!audit);
  const [exporting, setExporting] = useState(false);
  const [expandedActions, setExpandedActions] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [completedDays, setCompletedDays] = useState({});
  const reportRef = useRef(null);

  useEffect(() => {
    if (!audit && auditId) {
      const fetchAudit = async () => {
        try {
          const response = await axios.get(`${API}/audit/${auditId}`);
          setAudit(response.data);
        } catch (error) {
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
      await html2pdf().set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${audit.product_name}-ai-audit-report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0a0a0a' },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }).from(reportRef.current).save();
      toast.success("PDF exported!");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleShareTwitter = () => {
    const status = audit.is_recommended 
      ? `AI tools ARE recommending ${audit.product_name}! 🎉`
      : `Just ran an AI audit for ${audit.product_name} — got a 7-day action plan!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(status)}&url=${encodeURIComponent(window.location.href)}&hashtags=AImarketing,SaaS`, '_blank');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const toggleAction = (index) => {
    setExpandedActions(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleTaskComplete = (index) => {
    setCompletedTasks(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleDayComplete = (day) => {
    setCompletedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!audit) return null;

  const completedTaskCount = Object.values(completedTasks).filter(Boolean).length;
  const totalTasks = audit.action_plan?.length || 5;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <button data-testid="back-btn" onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Home</span>
          </button>
          <div className="flex items-center gap-3">
            <Button data-testid="share-twitter-btn" onClick={handleShareTwitter} variant="outline" size="sm" className="rounded-full gap-2">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button data-testid="export-pdf-btn" onClick={handleExportPDF} disabled={exporting} size="sm" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div ref={reportRef} className="px-6 md:px-12 py-8 md:py-12 bg-background">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Confidence Meter + Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Execution Confidence */}
            {audit.execution_confidence > 0 && (
              <div data-testid="confidence-meter" className="p-4 rounded-xl border border-accent/30 bg-accent/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">Execution Confidence</p>
                    <p className="text-xs text-muted-foreground">Based on action feasibility, signal strength & model responsiveness</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${getScoreBg(audit.execution_confidence)}`} style={{ width: `${audit.execution_confidence}%` }} />
                  </div>
                  <span className={`font-mono text-xl font-bold ${getScoreColor(audit.execution_confidence)}`}>{audit.execution_confidence}%</span>
                </div>
              </div>
            )}

            {/* Product Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">W</span>
                </div>
                <span className="font-mono text-sm text-muted-foreground">AI Visibility Report</span>
              </div>
              <h1 data-testid="report-product-name" className="font-heading text-3xl md:text-4xl font-semibold tracking-tight">{audit.product_name}</h1>
              <p className="text-lg text-muted-foreground mt-1">{audit.category}</p>
            </div>
          </motion.div>

          {/* Overall Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} data-testid="recommendation-status-card"
            className={`p-6 md:p-8 rounded-2xl border-2 ${audit.is_recommended ? "border-accent bg-accent/5" : "border-border bg-card"}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${audit.is_recommended ? "bg-accent" : "bg-muted"}`}>
                {audit.is_recommended ? <Check className="w-7 h-7 text-accent-foreground" /> : <X className="w-7 h-7 text-muted-foreground" />}
              </div>
              <div>
                <h2 className="font-heading text-xl md:text-2xl font-semibold">
                  {audit.is_recommended ? "AI is recommending your product" : "AI is not recommending your product"}
                </h2>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {audit.is_recommended ? `Position: ${audit.recommendation_position || 'Mentioned'}` : `Your product isn't mentioned for "${audit.category}"`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Model-Specific Analysis */}
          {audit.model_analyses && audit.model_analyses.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent" /> Model Analysis
              </h2>
              <div className="grid md:grid-cols-3 gap-3">
                {audit.model_analyses.map((model, index) => {
                  const colors = modelColors[model.model_name] || modelColors["ChatGPT"];
                  return (
                    <div key={index} className={`p-4 rounded-xl border ${colors.border} bg-card`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`font-semibold ${colors.text}`}>{colors.icon} {model.model_name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${model.is_recommended ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                          {model.is_recommended ? "Recommended" : "Not Found"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${getScoreBg(model.explainability_score)}`} style={{ width: `${model.explainability_score}%` }} />
                        </div>
                        <span className={`font-mono text-sm font-bold ${getScoreColor(model.explainability_score)}`}>{model.explainability_score}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{model.why_recommended_or_not}</p>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* 7-Day Timeline */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" /> 7-Day AI Visibility Sprint
            </h2>
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="font-mono text-sm">{Object.values(completedDays).filter(Boolean).length}/5 days</span>
              </div>
              <div className="space-y-2">
                {timelineDays.map((day, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <button
                      data-testid={`timeline-day-${index}`}
                      onClick={() => toggleDayComplete(day.range)}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                        completedDays[day.range] ? "bg-accent border-accent" : "border-border hover:border-accent/50"
                      }`}
                    >
                      {completedDays[day.range] && <Check className="w-4 h-4 text-accent-foreground" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${completedDays[day.range] ? "line-through text-muted-foreground" : ""}`}>{day.label}</span>
                        <span className="text-xs text-muted-foreground font-mono">{day.range}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Task Cards */}
          {audit.action_plan && audit.action_plan.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" /> Action Tasks
                </h2>
                <span className="text-sm text-muted-foreground">{completedTaskCount}/{totalTasks} complete</span>
              </div>
              
              <div className="space-y-3">
                {audit.action_plan.map((action, index) => {
                  const IconComponent = categoryIcons[action.category] || Zap;
                  const isExpanded = expandedActions[index];
                  const isComplete = completedTasks[index];
                  
                  return (
                    <div key={index} data-testid={`task-card-${index}`} className={`rounded-xl border bg-card overflow-hidden transition-all ${isComplete ? "border-accent/30 bg-accent/5" : "border-border"}`}>
                      {/* Task Header */}
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <button
                            data-testid={`task-checkbox-${index}`}
                            onClick={() => toggleTaskComplete(index)}
                            className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                              isComplete ? "bg-accent border-accent" : "border-border hover:border-accent/50"
                            }`}
                          >
                            {isComplete && <Check className="w-4 h-4 text-accent-foreground" />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className={`font-semibold ${isComplete ? "line-through text-muted-foreground" : ""}`}>
                                Task {index + 1}: {action.title}
                              </h3>
                              <button onClick={() => toggleAction(index)} className="text-muted-foreground hover:text-foreground shrink-0">
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </button>
                            </div>
                            
                            {/* Task Meta */}
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                                <User className="w-3 h-3" /> {action.owner || "Product"}
                              </span>
                              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                                <MapPin className="w-3 h-3" /> {action.location || "Homepage"}
                              </span>
                              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                                <Clock className="w-3 h-3" /> {action.effort || "30-45 mins"}
                              </span>
                              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent">
                                <Calendar className="w-3 h-3" /> {action.day_range || "Day 1-2"}
                              </span>
                            </div>
                            
                            {/* Model Tags */}
                            {action.improves_models && action.improves_models.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {action.improves_models.map((model, i) => {
                                  const colors = modelColors[model] || modelColors["ChatGPT"];
                                  return (
                                    <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                      {colors.icon} {model}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-border"
                          >
                            <div className="p-4 space-y-4">
                              {/* What to do */}
                              <div>
                                <p className="text-xs text-muted-foreground mb-1 font-medium">What to do</p>
                                <p className="text-sm">{action.what_to_do}</p>
                              </div>
                              
                              {/* Suggested Copy */}
                              {action.suggested_copy && (
                                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-accent font-medium">✨ AI-Optimized Copy</p>
                                    <Button
                                      data-testid={`copy-btn-${index}`}
                                      onClick={() => copyToClipboard(action.suggested_copy)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 px-2 text-xs gap-1"
                                    >
                                      <Copy className="w-3 h-3" /> Copy
                                    </Button>
                                  </div>
                                  <p className="text-sm font-mono bg-background/50 p-3 rounded border border-border leading-relaxed">
                                    {action.suggested_copy}
                                  </p>
                                </div>
                              )}
                              
                              {/* Before → After */}
                              {(action.before_explanation || action.after_explanation) && (
                                <div className="space-y-2">
                                  <p className="text-xs text-muted-foreground font-medium">How AI Explanation May Change</p>
                                  <div className="grid md:grid-cols-2 gap-3">
                                    {action.before_explanation && (
                                      <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                                        <p className="text-xs text-red-500 font-medium mb-1">Before</p>
                                        <p className="text-sm text-muted-foreground italic">"{action.before_explanation}"</p>
                                      </div>
                                    )}
                                    {action.after_explanation && (
                                      <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                                        <p className="text-xs text-green-500 font-medium mb-1">After (Expected)</p>
                                        <p className="text-sm italic">"{action.after_explanation}"</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Why it matters */}
                              <div className="text-xs text-muted-foreground">
                                <span className="font-medium">Why:</span> {action.why_it_matters}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* 7-Day Checkpoint */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} 
            className="p-6 rounded-2xl border-2 border-accent/30 bg-accent/5 space-y-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-accent" />
              <div>
                <h2 data-testid="checkpoint-title" className="font-heading text-xl font-semibold">7-Day AI Checkpoint</h2>
                <p className="text-sm text-muted-foreground">Re-scan after implementing changes</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-sm font-medium">What we will check:</p>
                <ul className="space-y-2">
                  {audit.validation_signals?.slice(0, 4).map((signal, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-green-500 font-medium mb-1">✓ Success Criteria</p>
                  <p className="text-sm">{audit.success_criteria || "+10 explainability score in ≥1 model"}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-500 font-medium mb-1">✗ Failure Criteria</p>
                  <p className="text-sm">{audit.failure_criteria || "No change in any model scores"}</p>
                </div>
              </div>
            </div>
            
            <Button
              data-testid="schedule-checkpoint-btn"
              onClick={() => navigate("/audit")}
              className="w-full md:w-auto rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            >
              <Calendar className="w-4 h-4" /> Schedule AI Checkpoint
            </Button>
          </motion.section>

          {/* Per-Model Impact Forecast */}
          {audit.impact_forecasts && audit.impact_forecasts.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
              <h2 className="font-heading text-lg font-semibold">Per-Model Impact Forecast</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {audit.impact_forecasts.map((forecast, index) => {
                  const colors = modelColors[forecast.model_name] || modelColors["ChatGPT"];
                  return (
                    <div key={index} className={`p-4 rounded-xl border ${colors.border} bg-card space-y-3`}>
                      <h3 className={`font-semibold ${colors.text}`}>{colors.icon} {forecast.model_name}</h3>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-green-500">↑</span> <span className="text-muted-foreground">Improves:</span>
                          <p className="text-sm mt-0.5">{forecast.signal_improves}</p>
                        </div>
                        <div>
                          <span className="text-yellow-500">→</span> <span className="text-muted-foreground">Changes:</span>
                          <p className="text-sm mt-0.5">{forecast.likely_changes}</p>
                        </div>
                        <div>
                          <span className="text-red-500">×</span> <span className="text-muted-foreground">Won't change:</span>
                          <p className="text-sm mt-0.5 text-muted-foreground">{forecast.will_not_change}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 md:px-12 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="p-4 rounded-xl border border-border bg-card flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-medium">Track your progress</p>
              <p className="text-sm text-muted-foreground">{completedTaskCount}/{totalTasks} tasks complete</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleShareTwitter} variant="outline" className="rounded-full gap-2">
                <Twitter className="w-4 h-4" /> Share
              </Button>
              <Button onClick={() => navigate("/audit")} className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <RotateCcw className="w-4 h-4" /> Re-scan
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 px-6 md:px-12 border-t border-border/50">
        <p className="max-w-6xl mx-auto font-mono text-xs text-muted-foreground">whyAIrecommend</p>
      </footer>
    </main>
  );
}
