import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const scanSteps = [
  { id: 1, text: "Analyzing product positioning", status: "pending" },
  { id: 2, text: "Testing AI recommendation prompts", status: "pending" },
  { id: 3, text: "Comparing against competitors", status: "pending" },
  { id: 4, text: "Generating insights", status: "pending" },
];

export default function ScanProgress() {
  const location = useLocation();
  const navigate = useNavigate();
  const [steps, setSteps] = useState(scanSteps);
  const [currentIndex, setCurrentIndex] = useState(0);
  const formData = location.state?.formData;

  useEffect(() => {
    if (!formData) {
      navigate("/audit");
      return;
    }

    const runAudit = async () => {
      try {
        const response = await axios.post(`${API}/run-audit`, formData, {
          timeout: 180000 // 3 minutes timeout for LLM processing
        });
        return response.data;
      } catch (error) {
        console.error("Audit failed:", error);
        throw error;
      }
    };

    // Animate steps
    const animateSteps = () => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < scanSteps.length) {
          setSteps(prev => prev.map((step, i) => ({
            ...step,
            status: i < index ? "complete" : i === index ? "active" : "pending"
          })));
          setCurrentIndex(index);
          index++;
        }
      }, 1500);
      return interval;
    };

    const stepInterval = animateSteps();

    runAudit()
      .then((result) => {
        clearInterval(stepInterval);
        setSteps(prev => prev.map(step => ({ ...step, status: "complete" })));
        setTimeout(() => {
          navigate(`/report/${result.id}`, { state: { auditResult: result } });
        }, 800);
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
    <main className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12">
      <div className="max-w-lg w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center"
          >
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </motion.div>
          <h1 
            data-testid="scan-title"
            className="font-heading text-2xl md:text-3xl font-semibold"
          >
            Analyzing {formData.product_name}
          </h1>
          <p className="text-muted-foreground">
            This usually takes 60-90 seconds
          </p>
        </div>

        {/* Steps */}
        <div 
          data-testid="scan-steps-container"
          className="space-y-4"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              data-testid={`scan-step-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                step.status === "complete" 
                  ? "border-accent/30 bg-accent/5" 
                  : step.status === "active"
                  ? "border-border bg-muted/50"
                  : "border-transparent bg-transparent"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                {step.status === "complete" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : step.status === "active" ? (
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-6 h-6 rounded-full border border-border" />
                )}
              </div>
              <span className={`font-medium ${
                step.status === "pending" ? "text-muted-foreground" : "text-foreground"
              }`}>
                {step.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <p 
          data-testid="scan-footer-note"
          className="text-center text-sm text-muted-foreground/60 font-mono"
        >
          Using controlled prompts to simulate buyer questions
        </p>
      </div>
    </main>
  );
}
