import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AuditPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    website_url: "",
    category: "",
    competitors: [],
  });
  const [competitorInput, setCompetitorInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addCompetitor = () => {
    if (competitorInput.trim() && formData.competitors.length < 3) {
      setFormData((prev) => ({
        ...prev,
        competitors: [...prev.competitors, competitorInput.trim()],
      }));
      setCompetitorInput("");
    }
  };

  const removeCompetitor = (indexToRemove) => {
    setFormData((prev) => {
      const newCompetitors = [...prev.competitors];
      newCompetitors.splice(indexToRemove, 1);
      return { ...prev, competitors: newCompetitors };
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCompetitor();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.product_name || !formData.website_url || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    // Navigate to scanning page with form data
    navigate("/scanning", { state: { formData } });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="py-6 px-6 md:px-12 lg:px-24">
        <button
          data-testid="back-to-home-btn"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-mono text-sm">Back</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col items-start justify-center px-6 md:px-12 lg:px-24 max-w-2xl mx-auto w-full">
        <div className="w-full space-y-12 py-8">
          <div className="space-y-4">
            <h1 
              data-testid="audit-form-title"
              className="font-heading text-3xl md:text-5xl tracking-tight"
            >
              Start your audit
            </h1>
            <p className="text-muted-foreground">
              Tell us about your product. This takes about 60 seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
              <Label 
                htmlFor="product_name" 
                className="text-xs uppercase tracking-widest text-muted-foreground font-mono"
              >
                Product Name *
              </Label>
              <Input
                data-testid="product-name-input"
                id="product_name"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                placeholder="e.g. Mailmodo"
                className="bg-transparent border-0 border-b border-border focus:border-foreground rounded-none px-0 py-4 text-xl placeholder:text-muted-foreground/50 transition-colors focus-visible:ring-0"
                required
              />
            </div>

            <div className="space-y-3">
              <Label 
                htmlFor="website_url" 
                className="text-xs uppercase tracking-widest text-muted-foreground font-mono"
              >
                Website URL *
              </Label>
              <Input
                data-testid="website-url-input"
                id="website_url"
                name="website_url"
                type="url"
                value={formData.website_url}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="bg-transparent border-0 border-b border-border focus:border-foreground rounded-none px-0 py-4 text-xl placeholder:text-muted-foreground/50 transition-colors focus-visible:ring-0"
                required
              />
            </div>

            <div className="space-y-3">
              <Label 
                htmlFor="category" 
                className="text-xs uppercase tracking-widest text-muted-foreground font-mono"
              >
                Category *
              </Label>
              <Input
                data-testid="category-input"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g. Email automation for SaaS"
                className="bg-transparent border-0 border-b border-border focus:border-foreground rounded-none px-0 py-4 text-xl placeholder:text-muted-foreground/50 transition-colors focus-visible:ring-0"
                required
              />
            </div>

            <div className="space-y-3">
              <Label 
                htmlFor="competitors" 
                className="text-xs uppercase tracking-widest text-muted-foreground font-mono"
              >
                Competitors (optional, max 3)
              </Label>
              <div className="flex gap-3">
                <Input
                  data-testid="competitors-input"
                  id="competitors"
                  value={competitorInput}
                  onChange={(e) => setCompetitorInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Customer.io, HubSpot"
                  disabled={formData.competitors.length >= 3}
                  className="bg-transparent border-0 border-b border-border focus:border-foreground rounded-none px-0 py-4 text-xl placeholder:text-muted-foreground/50 transition-colors focus-visible:ring-0"
                />
                <Button
                  data-testid="add-competitor-btn"
                  type="button"
                  onClick={addCompetitor}
                  disabled={formData.competitors.length >= 3 || !competitorInput.trim()}
                  variant="outline"
                  className="shrink-0 rounded-full"
                >
                  Add
                </Button>
              </div>
              
              {formData.competitors.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3">
                  {formData.competitors.map((competitor, index) => (
                    <span
                      key={`${competitor}-${index}`}
                      data-testid={`competitor-tag-${index}`}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm font-mono"
                    >
                      {competitor}
                      <button
                        type="button"
                        data-testid={`remove-competitor-${index}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeCompetitor(index);
                        }}
                        className="hover:text-destructive transition-colors p-0.5 rounded-full hover:bg-destructive/10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6">
              <Button
                data-testid="run-scan-btn"
                type="submit"
                disabled={loading}
                className="h-14 px-10 text-lg font-medium rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 group w-full md:w-auto"
              >
                Run AI Recommendation Scan
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
