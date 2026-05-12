"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ArticleCover from './ArticleCover';
import KeywordToken from './KeywordToken';

type Question = {
  id: number;
  text: string;
  options: string[];
};

type Tool = {
  slug: string;
  name: string;
  branch: string;
  color: string;
  keyword: string;
  tldr: string;
  description: string;
  long_description: string;
  questions: Question[];
};

export default function ToolAssessmentClient({ tool }: { tool: Tool }) {
  const [currentStep, setCurrentStep] = useState(-1); // -1 is intro
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Check if already saved
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

  const saveHistory = async (finalAnswers: any) => {
    if (!user) return;
    
    await supabase.from('assessment_history').insert({
      user_id: user.id,
      tool_slug: tool.slug,
      tool_name: tool.name,
      answers: finalAnswers
    });
  };

  const toggleSave = async () => {
    if (!user) {
      router.push('/signup');
      return;
    }

    if (isSaved) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', 'tool')
        .eq('item_slug', tool.slug);
      
      if (!error) setIsSaved(false);
    } else {
      const { error } = await supabase.from('user_favorites').insert({
        user_id: user.id,
        item_type: 'tool',
        item_slug: tool.slug,
        item_name: tool.name,
        item_keyword: tool.keyword,
        item_color: tool.color,
        item_branch: tool.branch
      });

      if (!error) setIsSaved(true);
    }
  };

  const handleAnswer = (questionId: number, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    if (currentStep < tool.questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      setTimeout(() => {
        setCurrentStep(tool.questions.length);
        setIsAnalyzing(true);
        saveHistory(newAnswers);
        setTimeout(() => setIsAnalyzing(false), 3000);
      }, 300);
    }
  };

  const progress = currentStep >= 0 
    ? ((currentStep) / tool.questions.length) * 100 
    : 0;

  const toolColor = tool.color || "#ffffff";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-4 sm:px-6 py-12 sm:py-20 flex flex-col justify-center">
        {/* Premium Header */}
        <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-16">
          <Link href="/" className="text-white/20 text-xs tracking-[0.3em] uppercase font-medium hover:text-white/40 transition-colors">
            SOR7ED
          </Link>
          
          {user ? (
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-white/50 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={() => supabase.auth.signOut().then(() => setUser(null))}
                className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/signup"
              className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium"
            >
              Sign In →
            </Link>
          )}
        </div>

      <div className="max-w-2xl mx-auto w-full">

        {/* Progress Bar */}
        {currentStep >= 0 && currentStep < tool.questions.length && (
          <div className="w-full h-1 bg-white/10 rounded-full mb-12 overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ backgroundColor: toolColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
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
              className="text-center"
            >
              <div className="mb-10 rounded-2xl overflow-hidden border border-white/10">
                <ArticleCover 
                  keyword={tool.keyword} 
                  branch={tool.branch} 
                  color={tool.color || "#ffffff"} 
                  title={tool.name} 
                />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight px-4">
                {tool.name}
              </h1>

              <p className="text-white/50 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed px-4">
                {tool.long_description || tool.tldr || tool.description}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 text-white/40 text-xs sm:text-sm mb-10 px-4">
                <span>{tool.questions.length} questions</span>
                <span>·</span>
                <span>Under 2 minutes</span>
                <span>·</span>
                <span>Personalized result</span>
              </div>

              <motion.button
                onClick={() => setCurrentStep(0)}
                className="w-full sm:w-auto bg-white text-black font-bold px-10 py-5 rounded-full transition-all duration-300"
                style={{ boxShadow: `0 0 40px ${toolColor}30` }}
                whileHover={{ scale: 1.05 }}
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
              className="bg-[#111111] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden"
            >
              <div 
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
                style={{ backgroundColor: toolColor, transform: 'translate(30%, -30%)' }}
              />
              
              <p className="text-white/40 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-6">
                Question {currentStep + 1} of {tool.questions.length}
              </p>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-10 leading-tight max-w-lg">
                {tool.questions[currentStep].text}
              </h2>
              
              <div className="space-y-3">
                {tool.questions[currentStep].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(tool.questions[currentStep].id, option)}
                    className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 rounded-xl border border-white/10 text-white/70 hover:text-white transition-all duration-200 group flex items-start gap-3 sm:gap-4 text-sm sm:text-base"
                    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span 
                        className="shrink-0 w-6 sm:w-7 h-6 sm:h-7 rounded-full border border-white/20 flex items-center justify-center text-[10px] sm:text-xs font-bold mt-0.5 group-hover:border-white/40 transition-colors"
                        style={{ color: toolColor }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ANALYZING & RESULTS SCREEN */}
          {currentStep === tool.questions.length && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {isAnalyzing ? (
                <div className="py-20">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 border-4 border-white/10 rounded-full mx-auto mb-8"
                    style={{ borderTopColor: toolColor }}
                  />
                  <h2 className="text-2xl font-bold mb-3">Analyzing your responses</h2>
                  <motion.p 
                    className="text-white/40"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Building your personalized protocol...
                  </motion.p>
                </div>
              ) : (
                <motion.div 
                  className="bg-[#111111] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div 
                    className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                    style={{ backgroundColor: toolColor, transform: 'translate(25%, -25%)' }}
                  />
                  
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <span className="text-2xl sm:text-3xl">🔒</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                    Assessment complete
                  </h2>

                  <p className="text-white/50 mb-6 max-w-md mx-auto text-base sm:text-lg leading-relaxed">
                    We have identified your specific pattern. Sign up to unlock your protocol on WhatsApp.
                  </p>
                  
                  <div className="mb-10">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest block mb-4">Your WhatsApp Keyword</span>
                    <KeywordToken 
                      keyword={tool.keyword} 
                      color={tool.color || "#ffffff"} 
                      size="large" 
                      interactive={true} 
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link
                      href="/signup"
                      className="inline-block bg-white text-black font-bold px-10 py-5 rounded-full hover:bg-white/90 transition-all duration-300"
                    >
                      Unlock Results & Get Protocol →
                    </Link>
                    <button
                      onClick={toggleSave}
                      className={`flex items-center justify-center gap-2 px-8 py-5 rounded-full border text-sm font-medium transition-all duration-300 ${
                        isSaved
                          ? 'bg-white/10 border-white/30 text-white'
                          : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span>{isSaved ? '★' : '☆'}</span>
                      {isSaved ? 'Saved to Dashboard' : 'Save to Dashboard'}
                    </button>
                  </div>

                  <div className="mt-8">
                    <button
                        onClick={() => {
                            setCurrentStep(-1);
                            setAnswers({});
                        }}
                        className="text-white/30 hover:text-white text-xs uppercase tracking-widest font-bold transition-all duration-300"
                    >
                        Retake Assessment
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
