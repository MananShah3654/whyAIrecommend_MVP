import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft, Check, X, RotateCcw, Users, FileText } from "lucide-react";
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
        <p className="text-muted-foreground font-mono">Loading report...</p>
      </main>
    );
  }

  if (!audit) return null;

  return (
    <main className="min-h-screen">
      <header className="py-6 px-6 md:px-12 lg:px-24 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            data-testid="back-btn"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">New Audit</span>
          </button>
          <span className="font-mono text-xs text-muted-foreground">
            Audit Report
          </span>
        </div>
      </header>

      <div className="px-6 md:px-12 lg:px-24 py-12 md:py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Product Info */}
          <div className="space-y-2">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Audit Results For
            </p>
            <h1 
              data-testid="report-product-name"
              className="font-heading text-4xl md:text-5xl tracking-tight"
            >
              {audit.product_name}
            </h1>
            <p className="text-muted-foreground">{audit.category}</p>
          </div>

          {/* Recommendation Status Card */}
          <div 
            data-testid="recommendation-status-card"
            className={`p-8 md:p-12 border rounded-sm ${
              audit.is_recommended 
                ? "border-lime/30 bg-lime/5" 
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">
                {audit.is_recommended ? "✓" : "✗"}
              </span>
              <div className="space-y-2">
                <h2 
                  data-testid="recommendation-status-text"
                  className="font-heading text-2xl md:text-3xl"
                >
                  {audit.is_recommended 
                    ? "Recommended by AI" 
                    : "Not recommended by AI"}
                </h2>
                {audit.is_recommended && audit.recommendation_position && (
                  <p className="text-muted-foreground font-mono text-sm">
                    Position: {audit.recommendation_position.charAt(0).toUpperCase() + audit.recommendation_position.slice(1)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Competitors Section */}
          {audit.recommended_competitors && audit.recommended_competitors.length > 0 && (
            <section className="space-y-6">
              <h2 
                data-testid="competitors-section-title"
                className="font-heading text-xl md:text-2xl"
              >
                AI recommends these tools instead
              </h2>
              <div className="space-y-4">
                {audit.recommended_competitors.map((competitor, index) => (
                  <div 
                    key={index}
                    data-testid={`competitor-item-${index}`}
                    className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0"
                  >
                    <span className="font-mono text-muted-foreground text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-medium">{competitor.name}</p>
                      <p className="text-sm text-muted-foreground">{competitor.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Explainability Breakdown */}
          <section className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <h2 
                data-testid="why-others-title"
                className="font-heading text-xl md:text-2xl"
              >
                Why AI recommends others
              </h2>
              <ul className="space-y-4">
                {audit.why_others_recommended?.map((reason, index) => (
                  <li 
                    key={index}
                    data-testid={`why-others-item-${index}`}
                    className="flex items-start gap-3"
                  >
                    <Check className="h-5 w-5 text-lime shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h2 
                data-testid="why-skipped-title"
                className="font-heading text-xl md:text-2xl"
              >
                Why your product is skipped
              </h2>
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
          </section>

          {/* Improvements Section */}
          <section className="space-y-6 p-8 md:p-12 border border-border rounded-sm bg-card">
            <h2 
              data-testid="improvements-title"
              className="font-heading text-xl md:text-2xl"
            >
              What you can improve for AI clarity
            </h2>
            <ol className="space-y-4">
              {audit.improvements?.map((improvement, index) => (
                <li 
                  key={index}
                  data-testid={`improvement-item-${index}`}
                  className="flex items-start gap-4"
                >
                  <span className="font-mono text-lime font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-foreground/90">{improvement}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Upgrade CTA */}
          <section 
            data-testid="upgrade-cta-section"
            className="py-12 md:py-16 border-t border-border/50 space-y-8"
          >
            <div className="space-y-4">
              <h2 className="font-heading text-2xl md:text-3xl">
                Want to track improvement and compare deeper?
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Unlock advanced features to monitor your AI recommendation status over time.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                data-testid="rerun-audit-btn"
                onClick={() => navigate("/audit")}
                className="h-12 px-6 rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Re-run audit monthly
              </Button>
              <Button
                data-testid="add-competitors-btn"
                variant="outline"
                className="h-12 px-6 rounded-full"
              >
                <Users className="mr-2 h-4 w-4" />
                Add more competitors
              </Button>
              <Button
                data-testid="export-pdf-btn"
                variant="outline"
                className="h-12 px-6 rounded-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                Export PDF report
              </Button>
            </div>

            <p className="text-xs text-muted-foreground font-mono pt-4">
              Signup and payment options available for premium features
            </p>
          </section>
        </div>
      </div>

      <footer className="py-8 px-6 md:px-12 lg:px-24 border-t border-border/50">
        <p className="text-xs text-muted-foreground font-mono max-w-6xl mx-auto">
          whyAIrecommend — AI Recommendation Diagnostics
        </p>
      </footer>
    </main>
  );
}
