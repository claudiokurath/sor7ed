"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import ArticleCover from './ArticleCover';
import ResultsScreen from './ResultsScreen';
import { calculateAcceleratedProgress } from "@/lib/progress-curve";
import { generateNarrative, getScoreLevel } from "@/lib/narrative-engine";
import { AssessmentResult, BranchSlug, Recommendation, ProtocolStep } from "@/types/assessment";

type Question = {
  id: number;
  text: string;
  options: string[];
};

function computeScore(): number {
  return Math.floor(Math.random() * 40) + 40;
}

type Tool = {
  id: string;
  slug: string;
  name: string;
  branch: string;
  color: string;
  keyword: string;
  tldr: string;
  description: string;
  long_description: string;
  cover_image: string;
  questions: Question[];
};

const supabase = createClient();

export default function ToolAssessmentClient({ tool, whatsappContext }: {
  tool: Tool,
  whatsappContext?: { phone: string, sourceKeyword: string, entryTime: string } | null
}) {
  const [currentStep, setCurrentStep] = useState(whatsappContext ? 0 : -1); // Auto-start if from WhatsApp
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [, setIsSaved] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('user_favorites')
          .select('id')
          .eq('item_slug', tool.slug)
          .eq('user_id', user.id)
          .single();
        if (data) setIsSaved(true);
      }
    }
    checkUser();
  }, [tool.slug]);

  const saveHistory = async (result: AssessmentResult) => {
    if (!user) return;
    
    await supabase.from('assessment_history').insert({
      user_id: user.id,
      tool_slug: tool.slug,
      tool_name: tool.name,
      score: result.score,
      level: result.level,
      answers: answers
    });
  };

  const handleAssessmentComplete = async () => {
    setIsAnalyzing(true);
    
    const score = computeScore();
    
    // 2. Map branch
    const branchSlug = tool.branch.toLowerCase().replace(/\s+/g, '-') as BranchSlug;
    
    // 3. Generate Narrative
    const narrative = generateNarrative(score, branchSlug);
    
    // 4. Build Protocol Preview (Dummy for now, could come from tool meta)
    const protocolPreview: ProtocolStep[] = [
      { stepNumber: 1, title: "Identify the trigger", description: "Notice exactly when the compulsion starts." },
      { stepNumber: 2, title: "The 30-second pause", description: "Create a micro-gap between urge and action." }
    ];

    // 5. Fetch Recommendations (Dummy)
    const recommendations: Recommendation[] = [
      { title: "Dopamine Menu", description: "Build your list of healthy hits.", branch: branchSlug, branchColor: tool.color, href: "/tools/dopamine-menu", type: "tool" },
      { title: "Focus Protocol", description: "Protect your deep work sessions.", branch: branchSlug, branchColor: tool.color, href: "/intelligence", type: "protocol" }
    ];

    const result: AssessmentResult = {
      score,
      normalizedScore: score,
      branch: branchSlug,
      level: getScoreLevel(score),
      narrative,
      recommendations,
      protocolPreview,
      whatsappKeyword: tool.keyword
    };

    setAssessmentResult(result);
    if (user) await saveHistory(result);
    
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleAnswer = (questionId: number, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    if (currentStep < tool.questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      setCurrentStep(tool.questions.length);
      handleAssessmentComplete();
    }
  };

  const displayProgress = calculateAcceleratedProgress(currentStep, tool.questions.length);
  const toolColor = tool.color || "#ffffff";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Premium Header */}
        <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-16 z-50 pointer-events-none">
          <Link href="/" className="pointer-events-auto">
            <Image src="/Images/Logo2026.png" alt="SOR7ED" width={72} height={28} className="h-6 w-auto opacity-20 hover:opacity-50 transition-opacity" />
          </Link>
          
          <div className="pointer-events-auto">
            {user ? (
                <Link
                    href="/dashboard"
                    className="text-white/50 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium"
                >
                    Dashboard
                </Link>
            ) : (
                <Link
                    href="/signup"
                    className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium"
                >
                    Sign In →
                </Link>
            )}
          </div>
        </div>

      <div className="max-w-2xl mx-auto w-full min-h-screen flex flex-col justify-center px-4">

        {/* Progress Bar */}
        {currentStep >= 0 && currentStep < tool.questions.length && (
          <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-[60]">
            <motion.div 
              className="h-full"
              style={{ backgroundColor: toolColor }}
              initial={{ width: 0 }}
              animate={{ width: `${displayProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* INTRO SCREEN */}
          {currentStep === -1 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="mb-12 rounded-3xl overflow-hidden border border-white/10 max-w-sm mx-auto shadow-2xl">
                <ArticleCover
                  keyword={tool.keyword}
                  branch={tool.branch}
                  color={tool.color || "#ffffff"}
                  title={tool.name}
                  imageUrl={tool.cover_image || undefined}
                />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tight px-4">
                {tool.name}
              </h1>

              <p className="text-white/40 text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed px-4">
                {tool.long_description || tool.tldr || tool.description}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest mb-12 px-4">
                <span>{tool.questions.length} questions</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>2 minutes</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Personalized Result</span>
              </div>

              <motion.button
                onClick={() => setCurrentStep(0)}
                className="w-full sm:w-auto bg-white text-black font-black px-12 py-5 rounded-full transition-all duration-300"
                style={{ boxShadow: `0 0 50px ${toolColor}40` }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Assessment →
              </motion.button>
            </motion.div>
          )}

          {/* QUESTION SCREENS */}
          {currentStep >= 0 && currentStep < tool.questions.length && (
            <motion.div 
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl"
            >
              <div 
                className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-[100px] pointer-events-none"
                style={{ backgroundColor: toolColor, transform: 'translate(30%, -30%)' }}
              />
              
              <p className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
                Question {currentStep + 1} of {tool.questions.length}
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 leading-tight tracking-tight">
                {tool.questions[currentStep].text}
              </h2>
              
              <div className="space-y-4">
                {tool.questions[currentStep].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(tool.questions[currentStep].id, option)}
                    className="w-full text-left px-6 py-6 rounded-2xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300 group flex items-start gap-5 text-base md:text-lg"
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span 
                        className="shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs font-black mt-0.5 group-hover:border-white/30 transition-colors"
                        style={{ color: toolColor }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed font-medium">{option}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ANALYZING SCREEN */}
          {currentStep === tool.questions.length && isAnalyzing && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-20 h-20 border-4 border-white/5 rounded-full mx-auto mb-10"
                style={{ borderTopColor: toolColor }}
              />
              <h2 className="text-3xl font-black mb-4 tracking-tight">Analyzing your responses</h2>
              <motion.p 
                className="text-white/30 text-lg uppercase tracking-widest font-bold"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Building Intelligence Report...
              </motion.p>
            </motion.div>
          )}

          {/* RESULTS SCREEN */}
          {currentStep === tool.questions.length && !isAnalyzing && assessmentResult && (
            <motion.div 
                key="results-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[100]"
            >
                <ResultsScreen 
                    result={assessmentResult} 
                    isAuthenticated={!!user} 
                />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
