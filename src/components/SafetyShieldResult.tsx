import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Info, 
  RefreshCw, Printer, Download, Sparkles, Thermometer, Gauge, Clock, Layers, FileText, Container
} from 'lucide-react';
import { SafetyAnalysisResult } from '../types';
import { scanRecipeUSDA } from '../data/usdaData';

interface SafetyShieldResultProps {
  result: SafetyAnalysisResult;
  onReset: () => void;
  onSaveToPantry: () => void;
}

export const SafetyShieldResult: React.FC<SafetyShieldResultProps> = ({
  result,
  onReset,
  onSaveToPantry
}) => {
  const initialJarSize = result.canningGuidelines.jarSize || result.selectedJarSize || 'Pint (16 oz)';
  const [activeJarSize, setActiveJarSize] = useState<string>(initialJarSize);
  const [currentResult, setCurrentResult] = useState<SafetyAnalysisResult>(result);

  const jarSizes = [
    '1/2 Pint (8 oz)',
    'Pint (16 oz)',
    'Quart (32 oz)',
    'Half Gallon (64 oz)',
    'Gallon (128 oz)'
  ];

  const handleJarSizeChange = (newSize: string) => {
    setActiveJarSize(newSize);
    const updated = scanRecipeUSDA(
      currentResult.recipeTitle,
      currentResult.recipeText || '',
      newSize
    );
    setCurrentResult({
      ...updated,
      redFlags: Array.from(new Set([...result.redFlags, ...updated.redFlags])),
      safeAlternatives: Array.from(new Set([...result.safeAlternatives, ...updated.safeAlternatives]))
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getMethodLabel = (method: string) => {
    if (method === 'NOT_SAFE') return 'Potentially Unsafe for Home Canning';
    if (method === 'PRESSURE_CANNER') return 'Pressure Canner Likely Required';
    return 'Water Bath May Be Appropriate If Tested Recipe';
  };

  const getScoreRatingLabel = (score: number) => {
    if (score >= 90) return 'No obvious red flags detected';
    if (score >= 60) return 'Review recommended';
    if (score >= 30) return 'Multiple safety concerns';
    return 'Do not can without tested guidance';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 50) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (score >= 50) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-orange-50 text-[#FF8107] border-[#FF8107]/30';
  };

  // SVG Gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentResult.safetyScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Top Banner & Header */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-gray-100 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FF8107]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 pb-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              USDA Food Safety Report
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D0D0D]">
              {result.recipeTitle}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {/* Status Badge */}
              <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${getScoreBg(result.safetyScore)} flex items-center space-x-1.5`}>
                {result.status === 'VERIFIED_SAFE' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {result.status === 'SAFE_WITH_MODIFICATIONS' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                {result.status === 'HIGH_RISK_DANGER' && <XCircle className="w-4 h-4 text-[#FF8107]" />}
                <span>{getScoreRatingLabel(result.safetyScore)}</span>
              </span>

              {/* Method Badge */}
              <span className="bg-[#0D0D0D] text-white border border-gray-800 px-3.5 py-1.5 rounded-full text-xs font-bold">
                {getMethodLabel(result.processingMethod)}
              </span>

              <span className="bg-orange-50 text-[#FF8107] border border-[#FF8107]/20 px-3 py-1.5 rounded-full text-xs font-bold">
                Est. pH: {result.estimatedPh}
              </span>
            </div>

            {result.methodMismatch && (
              <div className="mt-3 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-left flex items-start space-x-2.5 max-w-md">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-700 leading-snug">
                  You selected {result.userSelectedMethod === 'WATER_BATH' ? 'Water Bath' : 'Pressure Canning'}, but this recipe actually requires {getMethodLabel(result.processingMethod)}. Using the wrong method can result in unsafe, under-processed food.
                </p>
              </div>
            )}
          </div>

          {/* Animated Circular Safety Shield Gauge */}
          <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-gray-100"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className={getScoreColor(result.safetyScore)}
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-[#0D0D0D] leading-none">
                {result.safetyScore}%
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Safety Shield
              </span>
            </div>
          </div>
        </div>

        {/* Summary Callout Box */}
        <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start space-x-3">
          <Info className="w-5 h-5 text-[#FF8107] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 font-medium leading-relaxed">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Red Flags Section */}
      {result.redFlags.length > 0 && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-gray-100 text-left space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF8107]/10 flex items-center justify-center text-[#FF8107]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0D0D0D]">Red Flag Ingredients & Hazards</h3>
              <p className="text-xs text-gray-500">Detected ingredients that violate USDA canning safety guidelines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {result.redFlags.map((flag, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-[#FF8107]/5 border border-[#FF8107]/20 space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  {/* Bubble UI tag */}
                  <span className="bg-[#FF8107] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    {flag.keyword}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    {flag.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-800 font-semibold leading-relaxed pt-1">
                  {flag.reason}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Safe Alternatives Section */}
      {result.safeAlternatives.length > 0 && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-gray-100 text-left space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0D0D0D]">Safe USDA Modifications</h3>
              <p className="text-xs text-gray-500">Approved ingredient swaps to make this recipe shelf-stable</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {result.safeAlternatives.map((alt, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="line-through text-xs font-bold text-gray-400">{alt.original}</span>
                    <span className="text-xs font-black text-emerald-600">➔</span>
                    <span className="text-sm font-bold text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                      {alt.replacement}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-medium">
                    {alt.rationale}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Guidelines Table Grid */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-gray-100 text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF8107]">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0D0D0D]">Recommended Processing Parameters</h3>
              <p className="text-xs text-gray-500">USDA specified time, pressure, headspace & jar size guidelines</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-orange-50/80 px-3 py-1.5 rounded-2xl border border-[#FF8107]/20">
            <Container className="w-4 h-4 text-[#FF8107]" />
            <span className="text-xs font-black text-[#0D0D0D]">
              Jar Size: <span className="text-[#FF8107]">{activeJarSize}</span>
            </span>
          </div>
        </div>

        {/* Jar Size Switcher Strip */}
        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-600">
              Adjust Target Jar Size to Compare Processing Times & Headspaces:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {jarSizes.map((size) => {
              const isActive = activeJarSize === size;
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() => handleJarSizeChange(size)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#FF8107] text-white shadow-md shadow-[#FF8107]/25 scale-[1.02]'
                      : 'bg-white hover:bg-orange-50 border border-gray-200 text-gray-700 hover:border-[#FF8107]/40'
                  }`}
                >
                  <span>{size}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jar Size Specific Safety Note Alert */}
        {currentResult.canningGuidelines.jarSizeSafetyNote && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-start space-x-3 border ${
            currentResult.canningGuidelines.jarSizeSafetyNote.includes('🚨') || currentResult.canningGuidelines.jarSizeSafetyNote.includes('PROHIBITED')
              ? 'bg-red-50 text-red-900 border-red-200'
              : currentResult.canningGuidelines.jarSizeSafetyNote.includes('⚠️')
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#FF8107]" />
            <span className="leading-relaxed">{currentResult.canningGuidelines.jarSizeSafetyNote}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#FF8107]" />
              <span>Proc. Time</span>
            </span>
            <span className="text-lg font-black text-[#0D0D0D] block">
              {currentResult.canningGuidelines.processingTimeMinutes === 0
                ? 'NOT APPROVED'
                : `${currentResult.canningGuidelines.processingTimeMinutes} Mins`}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-[#FF8107]" />
              <span>Headspace</span>
            </span>
            <span className="text-lg font-black text-[#0D0D0D] block">
              {currentResult.canningGuidelines.recommendedHeadspace}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center space-x-1">
              <Gauge className="w-3.5 h-3.5 text-[#FF8107]" />
              <span>Dial Gauge</span>
            </span>
            <span className="text-base font-black text-[#0D0D0D] block">
              {currentResult.canningGuidelines.psiDialGauge}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center space-x-1">
              <Thermometer className="w-3.5 h-3.5 text-[#FF8107]" />
              <span>Weighted</span>
            </span>
            <span className="text-base font-black text-[#0D0D0D] block">
              {currentResult.canningGuidelines.psiWeightedGauge}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 font-medium">
          <span className="font-bold block mb-0.5">Altitude Rule:</span>
          {currentResult.canningGuidelines.altitudeAdjustment}
        </div>
      </div>

      {/* Mandatory USDA Disclaimer Notice */}
      <div className="p-5 rounded-2xl bg-gray-900 text-white text-left space-y-2 border border-gray-800 shadow-md">
        <div className="flex items-center space-x-2 text-[#FF8107]">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-wider">Mandatory Safety Disclaimer</span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-medium">
          This tool does not certify a recipe as safe. Always follow tested recipes and processing guidance from USDA, NCHFP, or a local Extension office.
        </p>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Analyze Another Recipe</span>
        </button>

        <div className="w-full sm:w-auto flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-5 py-3.5 rounded-full border border-gray-300 font-bold text-gray-800 hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onSaveToPantry}
            className="flex-1 sm:flex-none px-6 py-3.5 rounded-full bg-[#FF8107] hover:bg-[#e06f00] text-white font-bold shadow-lg shadow-[#FF8107]/25 flex items-center justify-center space-x-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Log Batch to Digital Pantry</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
