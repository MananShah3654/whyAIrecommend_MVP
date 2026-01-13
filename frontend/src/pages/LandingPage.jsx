import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-start justify-center px-6 md:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        <div className="space-y-8 py-16 md:py-24">
          <h1 
            data-testid="hero-headline"
            className="font-heading text-5xl md:text-7xl tracking-tight leading-[0.95] text-foreground"
          >
            Is AI recommending your product
            <span className="text-lime"> — </span>
            or your competitor?
          </h1>
          
          <p 
            data-testid="hero-subheadline"
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Run a 2-minute AI recommendation audit to see how tools like ChatGPT explain your category.
          </p>
          
          <div className="pt-4">
            <Button
              data-testid="run-free-audit-btn"
              onClick={() => navigate("/audit")}
              className="h-14 px-10 text-lg font-medium rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 group"
            >
              Run Free Audit
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <p 
            data-testid="trust-line"
            className="text-sm text-muted-foreground/70 font-mono tracking-wide"
          >
            No signup required · No SEO · No content generation
          </p>
        </div>
      </div>
      
      <footer className="py-8 px-6 md:px-12 lg:px-24 border-t border-border/50">
        <p className="text-xs text-muted-foreground font-mono">
          whyAIrecommend — AI Recommendation Diagnostics
        </p>
      </footer>
    </main>
  );
}
