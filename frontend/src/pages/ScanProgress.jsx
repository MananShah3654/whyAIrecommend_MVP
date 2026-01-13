import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const scanSteps = [
  { id: 1, text: "Testing AI recommendation prompts", duration: 2000 },
  { id: 2, text: "Checking category-level suggestions", duration: 2500 },
  { id: 3, text: "Comparing against known competitors", duration: 3000 },
  { id: 4, text: "Analyzing how AI explains results", duration: 2500 },
];

export default function ScanProgress() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const formData = location.state?.formData;

  useEffect(() => {
    if (!formData) {
      navigate("/audit");
      return;
    }

    // Run the actual audit
    const runAudit = async () => {
      try {
        const response = await axios.post(`${API}/run-audit`, formData);
        return response.data;
      } catch (error) {
        console.error("Audit failed:", error);
        throw error;
      }
    };

    // Animate steps while audit runs
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < scanSteps.length) {
        setCurrentStep(stepIndex);
        if (stepIndex > 0) {
          setCompletedSteps((prev) => [...prev, stepIndex - 1]);
        }
        stepIndex++;
      }
    }, 2000);

    // Run audit and navigate when done
    runAudit()
      .then((result) => {
        // Complete all steps visually
        setCompletedSteps([0, 1, 2, 3]);
        setCurrentStep(4);
        
        setTimeout(() => {
          navigate(`/report/${result.id}`, { state: { auditResult: result } });
        }, 1000);
      })
      .catch((error) => {
        clearInterval(stepInterval);
        toast.error("Audit failed. Please try again.");
        setTimeout(() => navigate("/audit"), 2000);
      });

    return () => clearInterval(stepInterval);
  }, [formData, navigate]);

  if (!formData) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-24">
      <div className="max-w-xl w-full space-y-12">
        <div className="space-y-4">
          <h1 
            data-testid="scan-title"
            className="font-heading text-3xl md:text-4xl tracking-tight"
          >
            Scanning {formData.product_name}
          </h1>
          <p className="text-muted-foreground">
            Analyzing AI recommendation behavior...
          </p>
        </div>

        <div 
          data-testid="scan-steps-container"
          className="font-mono text-sm md:text-base space-y-4"
        >
          <AnimatePresence mode="wait">
            {scanSteps.map((step, index) => (
              <motion.div
                key={step.id}
                data-testid={`scan-step-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: index <= currentStep ? 1 : 0.3,
                  y: 0 
                }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {completedSteps.includes(index) ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lime"
                    >
                      ✓
                    </motion.span>
                  ) : index === currentStep ? (
                    <span className="w-2 h-2 bg-lime rounded-full animate-pulse-dot" />
                  ) : (
                    <span className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                  )}
                </span>
                <span className={completedSteps.includes(index) ? "text-foreground" : index === currentStep ? "text-foreground" : "text-muted-foreground/50"}>
                  {step.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <p 
          data-testid="scan-footer-note"
          className="text-xs text-muted-foreground/70 font-mono"
        >
          We use controlled prompts to simulate real buyer questions.
        </p>
      </div>
    </main>
  );
}
