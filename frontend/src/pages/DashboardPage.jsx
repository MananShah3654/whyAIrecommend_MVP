import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X, 
  TrendingUp, 
  Clock, 
  BarChart3,
  Calendar,
  ExternalLink,
  Trash2,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    recommended: 0,
    notRecommended: 0,
    improvementRate: 0
  });

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await axios.get(`${API}/audits`);
      const auditData = response.data || [];
      setAudits(auditData);
      
      // Calculate stats
      const total = auditData.length;
      const recommended = auditData.filter(a => a.is_recommended).length;
      const notRecommended = total - recommended;
      const improvementRate = total > 0 ? Math.round((recommended / total) * 100) : 0;
      
      setStats({ total, recommended, notRecommended, improvementRate });
    } catch (error) {
      console.error("Failed to fetch audits:", error);
      toast.error("Failed to load audit history");
    } finally {
      setLoading(false);
    }
  };

  const deleteAudit = async (auditId) => {
    try {
      await axios.delete(`${API}/audit/${auditId}`);
      toast.success("Audit deleted");
      fetchAudits();
    } catch (error) {
      console.error("Failed to delete audit:", error);
      toast.error("Failed to delete audit");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              data-testid="back-home-btn"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Home</span>
            </button>
            <div className="h-4 w-px bg-border" />
            <h1 className="font-heading font-semibold">Audit History</h1>
          </div>
          <Button
            data-testid="new-audit-btn"
            onClick={() => navigate("/audit")}
            size="sm"
            className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            New Audit
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div 
            data-testid="stat-total"
            className="p-6 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="font-heading text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Audits</p>
          </div>

          <div 
            data-testid="stat-recommended"
            className="p-6 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="font-heading text-3xl font-bold text-green-500">{stats.recommended}</p>
            <p className="text-sm text-muted-foreground">Recommended</p>
          </div>

          <div 
            data-testid="stat-not-recommended"
            className="p-6 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <X className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <p className="font-heading text-3xl font-bold text-red-500">{stats.notRecommended}</p>
            <p className="text-sm text-muted-foreground">Not Recommended</p>
          </div>

          <div 
            data-testid="stat-rate"
            className="p-6 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="font-heading text-3xl font-bold">{stats.improvementRate}%</p>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
        </motion.div>

        {/* Audit List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-semibold">All Audits</h2>
            <p className="text-sm text-muted-foreground">{audits.length} audits</p>
          </div>

          {audits.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">No audits yet</h3>
              <p className="text-muted-foreground mb-6">Run your first audit to start tracking</p>
              <Button
                data-testid="empty-state-cta"
                onClick={() => navigate("/audit")}
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Run First Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {audits.map((audit, index) => (
                <motion.div
                  key={audit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`audit-row-${index}`}
                  className="group p-5 rounded-xl border border-border bg-card hover:border-accent/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Product Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        audit.is_recommended ? "bg-green-500/10" : "bg-red-500/10"
                      }`}>
                        {audit.is_recommended ? (
                          <Check className="w-6 h-6 text-green-500" />
                        ) : (
                          <X className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-heading font-semibold text-lg truncate">
                            {audit.product_name}
                          </h3>
                          {audit.is_recommended && audit.recommendation_position && (
                            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                              {audit.recommendation_position}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{audit.category}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(audit.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {new URL(audit.website_url).hostname}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button
                        data-testid={`view-audit-${index}`}
                        onClick={() => navigate(`/report/${audit.id}`)}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                      >
                        View Report
                      </Button>
                      <Button
                        data-testid={`delete-audit-${index}`}
                        onClick={() => {
                          if (window.confirm("Delete this audit?")) {
                            deleteAudit(audit.id);
                          }
                        }}
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Competitors preview */}
                  {audit.recommended_competitors && audit.recommended_competitors.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Competitors mentioned:</p>
                      <div className="flex flex-wrap gap-2">
                        {audit.recommended_competitors.slice(0, 3).map((comp, i) => (
                          <span key={i} className="px-2 py-1 rounded-full bg-muted text-xs">
                            {comp.name}
                          </span>
                        ))}
                        {audit.recommended_competitors.length > 3 && (
                          <span className="px-2 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                            +{audit.recommended_competitors.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pro Upgrade Banner */}
        {audits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-8 rounded-2xl border-2 border-accent/20 bg-accent/5"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-semibold">Unlock Pro Features</h3>
                <p className="text-muted-foreground">
                  Get unlimited audits, automated monthly tracking, and detailed trend analysis.
                </p>
              </div>
              <Button
                data-testid="upgrade-pro-btn"
                onClick={() => navigate("/pricing")}
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
              >
                Upgrade to Pro
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="font-mono text-sm text-muted-foreground">whyAIrecommend</p>
        </div>
      </footer>
    </main>
  );
}
