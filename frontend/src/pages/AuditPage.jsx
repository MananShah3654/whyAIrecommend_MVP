import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft, ArrowRight, X, Globe, Tag, Users, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AuditPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    product_name: "",
    website_url: "",
    category: "",
    competitors: [],
  });
  const [competitorInput, setCompetitorInput] = useState("");

  const steps = [
    {
      id: "product",
      icon: Building2,
      question: "What's your product called?",
      subtitle: "Enter your SaaS product name",
      field: "product_name",
      placeholder: "e.g. Mailmodo, Notion, Linear",
      type: "text"
    },
    {
      id: "website",
      icon: Globe,
      question: "What's your website?",
      subtitle: "We'll analyze your positioning",
      field: "website_url",
      placeholder: "https://yourproduct.com",
      type: "url"
    },
    {
      id: "category",
      icon: Tag,
      question: "What category are you in?",
      subtitle: "How would a buyer describe what you do?",
      field: "category",
      placeholder: "e.g. Email automation for SaaS, Project management",
      type: "text"
    },
    {
      id: "competitors",
      icon: Users,
      question: "Who are your competitors?",
      subtitle: "Optional — helps us compare (max 3)",
      field: "competitors",
      placeholder: "e.g. Customer.io, HubSpot",
      type: "competitors"
    }
  ];

  const currentStepData = steps[currentStep];

  const handleInputChange = (value) => {
    setFormData((prev) => ({ ...prev, [currentStepData.field]: value }));
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
      if (currentStepData.type === "competitors") {
        if (competitorInput.trim()) {
          addCompetitor();
        } else {
          handleNext();
        }
      } else {
        handleNext();
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      // Validate current step (except competitors which is optional)
      if (currentStepData.type !== "competitors" && !formData[currentStepData.field]?.trim()) {
        toast.error("Please fill in this field");
        return;
      }
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  const handleSubmit = () => {
    if (!formData.product_name || !formData.website_url || !formData.category) {
      toast.error("Please complete all required fields");
      return;
    }
    navigate("/scanning", { state: { formData } });
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            data-testid="back-btn"
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-mono">
              {currentStep + 1} / {steps.length}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mt-6">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-8 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <currentStepData.icon className="w-8 h-8 text-accent" />
              </div>

              {/* Question */}
              <div className="space-y-2">
                <h1 
                  data-testid="step-question"
                  className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight"
                >
                  {currentStepData.question}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {currentStepData.subtitle}
                </p>
              </div>

              {/* Input */}
              {currentStepData.type === "competitors" ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      data-testid="competitors-input"
                      type="text"
                      value={competitorInput}
                      onChange={(e) => setCompetitorInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={currentStepData.placeholder}
                      disabled={formData.competitors.length >= 3}
                      className="flex-1 bg-transparent border-0 border-b-2 border-border focus:border-accent px-0 py-4 text-2xl md:text-3xl placeholder:text-muted-foreground/40 transition-colors focus:outline-none"
                      autoFocus
                    />
                    <Button
                      data-testid="add-competitor-btn"
                      type="button"
                      onClick={addCompetitor}
                      disabled={formData.competitors.length >= 3 || !competitorInput.trim()}
                      variant="outline"
                      className="shrink-0 rounded-full h-auto py-4 px-6"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {formData.competitors.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {formData.competitors.map((competitor, index) => (
                        <motion.span
                          key={`${competitor}-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          data-testid={`competitor-tag-${index}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-base font-medium"
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
                            className="hover:text-destructive transition-colors p-1 rounded-full hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  data-testid={`${currentStepData.field}-input`}
                  type={currentStepData.type}
                  value={formData[currentStepData.field]}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={currentStepData.placeholder}
                  className="w-full bg-transparent border-0 border-b-2 border-border focus:border-accent px-0 py-4 text-2xl md:text-3xl placeholder:text-muted-foreground/40 transition-colors focus:outline-none"
                  autoFocus
                />
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-8">
                <Button
                  data-testid="next-btn"
                  onClick={handleNext}
                  size="lg"
                  className="h-14 px-8 text-lg font-medium rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all group"
                >
                  {currentStep === steps.length - 1 ? "Run Audit" : "Continue"}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                {currentStepData.type === "competitors" && (
                  <button
                    data-testid="skip-btn"
                    onClick={handleSubmit}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Skip this step
                  </button>
                )}
              </div>

              {/* Keyboard hint */}
              <p className="text-sm text-muted-foreground/60 font-mono">
                Press Enter ↵ to continue
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
