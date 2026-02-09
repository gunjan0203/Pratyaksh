// frontend/src/pages/DamageEstimator.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Image,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  RotateCcw,
  Download,
  Map
} from "lucide-react";
import "./DamageEstimator.css";

interface DamageResult {
  damage_percentage: number;
  severity_score: number;
  estimated_loss: string;
  recommended_aid: string[];
  affected_areas: {
    area: string;
    damage: number;
  }[];
}

async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}


const DamageEstimator: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);

  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<DamageResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [heatmapUrl, setHeatmapUrl] = useState<string | null>(null);

  // STEP 2E — restore data on refresh
  useEffect(() => {
    const savedBefore = localStorage.getItem("beforePreview");
    const savedAfter = localStorage.getItem("afterPreview");
    const savedAnalysis = localStorage.getItem("damageAnalysis");
    const savedHeatmap = localStorage.getItem("damageHeatmap");

    if (savedHeatmap) {setHeatmapUrl(`http://localhost:8000/${savedHeatmap}`);}
    if (savedBefore) setBeforePreview(savedBefore);
    if (savedAfter) setAfterPreview(savedAfter);
    if (savedAnalysis) setAnalysis(JSON.parse(savedAnalysis));
  }, []);

  const beforeDropzone = useDropzone({
    disabled: analysis !== null,
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    onDrop: (files) => {
      const file = files[0];
      setBeforeImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBeforePreview(result);
        localStorage.setItem("beforePreview", result);
      };
      reader.readAsDataURL(file);
    }
  });

  const afterDropzone = useDropzone({
    disabled: analysis !== null,
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    onDrop: (files) => {
      const file = files[0];
      setAfterImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAfterPreview(result);
        localStorage.setItem("afterPreview", result);
      };
      reader.readAsDataURL(file);
    }
  });

  const analyzeDamage = async () => {
    // 🚫 HARD STOP if analysis already exists
    if (analysis) return;
    if (!beforeImage || !afterImage) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      // 🔐 HASH FILES BEFORE UPLOAD
      const beforeHash = await hashFile(beforeImage);
      const afterHash = await hashFile(afterImage);
      const analysisKey = `damage_${beforeHash}_${afterHash}`;

      // 🚫 DUPLICATE CHECK (NO UPLOAD)
      const cached = localStorage.getItem(analysisKey);
      if (cached) {
        setAnalysis(JSON.parse(cached));
        setIsAnalyzing(false);
        return;
      }

      // ✅ ONLY NOW DO WE UPLOAD
      const formData = new FormData();
      formData.append("before_img", beforeImage);
      formData.append("after_img", afterImage);

      const response = await fetch(
        "http://localhost:8000/analysis/deep-damage-assessment",
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const raw = await response.json();

      const normalized: DamageResult = {
        damage_percentage: raw.results.damage_percent,
        severity_score:
          raw.results.severity === "Critical" ? 8 :
          raw.results.severity === "Moderate" ? 6 : 3,
        estimated_loss: raw.results.estimated_cost,
        recommended_aid: [
          "Deploy emergency response teams",
          "Conduct structural safety inspections",
          "Provide temporary shelters"
        ],
        affected_areas: []
      };

      setHeatmapUrl(`http://localhost:8000/${raw.results.heatmap_url}`);
      localStorage.setItem("damageHeatmap", raw.results.heatmap_url);


      // 💾 CACHE RESULT (CRITICAL)
      setAnalysis(normalized);
      localStorage.setItem(analysisKey, JSON.stringify(normalized));
      localStorage.setItem("damageAnalysis", JSON.stringify(normalized));
    } catch (error) {
      console.error(error);
      alert("Damage analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };


  // clear everything
  const resetAnalysis = () => {
    setBeforeImage(null);
    setAfterImage(null);
    setBeforePreview(null);
    setAfterPreview(null);
    setAnalysis(null);
    setHeatmapUrl(null);

    localStorage.clear();
  };


  return (
    <motion.div
      className="damage-estimator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="estimator-header">
        <h1>AI Damage Estimator</h1>
        <p>Upload before and after disaster images for damage analysis</p>
      </div>

      <div className="upload-grid">
        <div className="upload-card">
          <h3><Image /> Before Disaster</h3>
          <div {...beforeDropzone.getRootProps()} className="dropzone">
            <input {...beforeDropzone.getInputProps()} />
            {beforePreview ? (
              <img src={beforePreview} className="preview-image" />
            ) : (
              <>
                <Upload />
                <p>Upload image</p>
              </>
            )}
          </div>
        </div>

        <div className="upload-card">
          <h3><Image /> After Disaster</h3>
          <div {...afterDropzone.getRootProps()} className="dropzone">
            <input {...afterDropzone.getInputProps()} />
            {afterPreview ? (
              <img src={afterPreview} className="preview-image" />
            ) : (
              <>
                <Upload />
                <p>Upload image</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <motion.button
          className="damage-analyze-btn" // Renamed
          onClick={analyzeDamage}
          disabled={!beforeImage || !afterImage || isAnalyzing || analysis !== null}
          whileHover={{ scale: 1.02 }}
        >
          {isAnalyzing ? "Analyzing..." : <><BarChart3 size={20} /> Estimate Damage</>}
        </motion.button>

        <motion.button
          className="damage-reset-btn" // Renamed
          onClick={resetAnalysis}
          whileHover={{ scale: 1.02 }}
        >
          <RotateCcw size={20} /> Reset
        </motion.button>
      </div>

      {analysis && (
        <motion.div className="results-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Damage Analysis Results</h2>

          <div className="damage-summary">
            <div className="summary-card critical">
              <h3>Damage Severity</h3>
              <p>{analysis.damage_percentage}%</p>
            </div>

            <div className="summary-card">
              <h3><TrendingUp /> Estimated Loss</h3>
              <p>{analysis.estimated_loss}</p>
            </div>

            <div className="summary-card">
              <h3><AlertTriangle /> Severity Level</h3>
              <p>{analysis.severity_score}/10</p>
            </div>
          </div>

          <div className="recommendations-section">
            <h3><CheckCircle /> Recommended Actions</h3>
            {analysis.recommended_aid.length > 0 ? (
              analysis.recommended_aid.map((rec, i) => (
                <p key={i}>• {rec}</p>
              ))
            ) : (
              <p>No recommendations available</p>
            )}
          </div>
            {heatmapUrl && (
            <div className="heatmap-section">
              <h3><Map /> Damage Heatmap</h3>
              <img
                src={heatmapUrl}
                alt="Damage Heatmap"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  borderRadius: "12px"
                }}
              />
            </div>
          )}
          <div className="export-section">
            <button><Download /> Export Report</button>
            <button><Map /> Share</button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DamageEstimator;