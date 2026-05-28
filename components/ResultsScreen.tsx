'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AssessmentResult, ScoreLevel, ProtocolStep, Recommendation, DeepDive } from '@/types/assessment';
import { getBranchColor } from '@/lib/branch-config';
import KeywordToken from './KeywordToken';

import { siteConfig } from '@/lib/constants';

interface ResultsScreenProps {
  result: AssessmentResult;
  onWhatsAppCTA?: () => void;
  isAuthenticated: boolean;
}

export default function ResultsScreen({ result, onWhatsAppCTA, isAuthenticated }: ResultsScreenProps) {
  const [revealPhase, setRevealPhase] = useState<'score' | 'narrative' | 'protocol' | 'cta'>('score');
  const branchColor = getBranchColor(result.branch);

  useEffect(() => {
    const sequence = [
      { phase: 'narrative' as const, delay: 1200 },
      { phase: 'protocol' as const, delay: 2800 },
      { phase: 'cta' as const, delay: 4200 },
    ];
    sequence.forEach(({ phase, delay }) => {
      setTimeout(() => setRevealPhase(phase), delay);
    });
  }, []);

  // Non-authenticated: show WhatsApp CTA + optional signup
  if (!isAuthenticated) {
    const whatsappURL = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(result.whatsappKeyword)}`;
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="max-w-sm w-full text-center space-y-8">
          <ScoreVisualization score={result.score} branchColor={branchColor} branch={result.branch} />

          <div>
            <h2 className="text-2xl font-black tracking-tight mb-3">{result.narrative.headline}</h2>
            <p className="text-white/40 text-sm leading-relaxed">{result.narrative.subheadline}</p>
          </div>

          <div className="space-y-3">
            <motion.a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-5 font-black text-black text-sm uppercase tracking-widest transition-all"
              style={{ backgroundColor: branchColor }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send results to my WhatsApp
            </motion.a>
            <p className="text-white/20 text-xs">
              Save your results →{' '}
              <Link href="/signup" className="text-white/40 underline underline-offset-4 hover:text-white transition-colors">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col snap-y snap-mandatory overflow-y-auto no-scrollbar">
      
      {/* Act One: The Verdict - Immediate Impact */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 snap-start relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[100px] transform-gpu"
                style={{ background: `radial-gradient(circle, ${branchColor} 0%, transparent 70%)` }}
            />
        </div>

        <ScoreVisualization 
          score={result.score}
          branchColor={branchColor}
          branch={result.branch}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12 max-w-sm relative z-10"
        >
          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6 tracking-tight">
            {result.narrative.headline}
          </h1>
          <UrgencyIndicator urgency={result.narrative.urgency} color={branchColor} />
        </motion.div>

        <motion.div 
            className="absolute bottom-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
        >
            <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">The Insight</span>
                <motion.div 
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" 
                />
            </div>
        </motion.div>
      </section>

      {/* Act Two: The Insight + Protocol Preview */}
      <AnimatePresence>
        {(revealPhase === 'narrative' || revealPhase === 'protocol' || revealPhase === 'cta') && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-16 py-20 snap-start max-w-3xl mx-auto"
          >
            {/* Narrative Insight */}
            <div className="mb-16">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 leading-tight">
                {result.narrative.subheadline}
              </h2>
              <p className="text-white/50 text-base md:text-lg leading-relaxed">
                {result.narrative.insight}
              </p>
            </div>

            {/* Protocol */}
            <ProtocolPreview
              steps={result.protocolPreview}
              branchColor={branchColor}
              isVisible={revealPhase === 'protocol' || revealPhase === 'cta'}
            />

            {/* Deep Dive */}
            {result.deepDive && (revealPhase === 'protocol' || revealPhase === 'cta') && (
              <DeepDiveSection deepDive={result.deepDive} branchColor={branchColor} />
            )}

            {/* Related Tools */}
            <RecommendationGrid
              recommendations={result.recommendations}
              isVisible={revealPhase === 'cta'}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Act Three: The WhatsApp Bridge */}
      <AnimatePresence>
        {revealPhase === 'cta' && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky bottom-0 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-black via-black/95 to-transparent z-50"
          >
            <WhatsAppCTA
              result={result}
              onCTA={onWhatsAppCTA}
              branchColor={branchColor}
              isAuthenticated={isAuthenticated}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Supporting Components
function ScoreVisualization({ score, branchColor, branch }: {
  score: number;
  branchColor: string;
  branch: string;
}) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative">
      <svg width="180" height="180" className="-rotate-90">
        <circle 
          cx="90" cy="90" r={radius} 
          stroke="white" strokeOpacity="0.05" strokeWidth="10" 
          fill="none" 
        />
        <motion.circle
          cx="90" cy="90" r={radius}
          stroke={branchColor}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.8, delay: 0.3, ease: 'easeOut' }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'backOut' }}
          className="text-6xl font-black tabular-nums"
          style={{ color: branchColor }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-2 font-bold">
          {branch}
        </span>
      </div>
    </div>
  );
}

function ProtocolPreview({ steps, branchColor, isVisible }: {
  steps: ProtocolStep[];
  branchColor: string;
  isVisible: boolean;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8">
            Your Protocol Preview
          </h2>

          <div className="space-y-4 mb-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/5"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 border"
                  style={{ backgroundColor: `${branchColor}15`, color: branchColor, borderColor: `${branchColor}30` }}
                >
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-white mb-2">{step.title}</p>
                  <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative p-8 rounded-3xl bg-white/5 border border-white/5 overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-10 p-6 text-center">
              <div>
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Full protocol unlocks via WhatsApp
                </h3>
                <p className="text-white/40 text-sm">
                  Ongoing micro-actions + progress tracking
                </p>
              </div>
            </div>
            
            <div className="blur-md select-none pointer-events-none opacity-20">
              <div className="flex gap-6 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20" />
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-10 h-10 rounded-full bg-white/20" />
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-white/10 rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RecommendationGrid({ recommendations, isVisible }: {
  recommendations: Recommendation[];
  isVisible: boolean;
}) {
  const tools = recommendations.filter(r => r.type === 'tool');
  const intelligence = recommendations.filter(r => r.type === 'intelligence' || r.type === 'protocol');

  return (
    <AnimatePresence>
      {isVisible && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Tools Section */}
          {tools.length > 0 && (
            <div className="mb-10">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-6">
                Tactical Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tools.map((rec, index) => (
                  <RecommendationCard key={index} rec={rec} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Intelligence Section */}
          {intelligence.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-6">
                Context & Theory
              </h2>
              <div className="space-y-4">
                {intelligence.map((rec, index) => (
                  <motion.a
                    key={index}
                    href={rec.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (tools.length * 0.1) + (index * 0.1) }}
                    className="block p-6 rounded-3xl bg-[#0f0f0f] border border-white/5 
                               hover:bg-white/[0.03] transition-all group relative overflow-hidden"
                    style={{ borderLeftColor: rec.branchColor, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span
                          className="text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
                          style={{ color: rec.branchColor }}
                        >
                          Field Notes • {rec.branch}
                        </span>
                        <p className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-white/90 transition-colors">
                          {rec.title}
                        </p>
                        <p className="text-sm text-white/30 leading-relaxed line-clamp-2">
                          {rec.description}
                        </p>
                      </div>
                      <div className="text-white/20 group-hover:text-white/40 transition-colors mt-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RecommendationCard({ rec, index }: { rec: Recommendation, index: number }) {
  return (
    <motion.a
      href={rec.href}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-3xl bg-[#0f0f0f] border border-white/5 
                 hover:bg-white/[0.03] transition-all group"
      style={{ borderLeftColor: rec.branchColor, borderLeftWidth: '4px' }}
    >
      <span
        className="text-[10px] font-black uppercase tracking-[0.2em] block mb-3"
        style={{ color: rec.branchColor }}
      >
        {rec.branch}
      </span>
      <p className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-white/90 transition-colors">{rec.title}</p>
      <p className="text-sm text-white/30 leading-relaxed line-clamp-2">
        {rec.description}
      </p>
    </motion.a>
  );
}

function WhatsAppCTA({ result, onCTA, branchColor, isAuthenticated }: {
  result: AssessmentResult;
  onCTA?: () => void;
  branchColor: string;
  isAuthenticated: boolean;
}) {
  const whatsappURL = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(result.whatsappKeyword)}`;

  return (
    <div className="max-w-md mx-auto w-full space-y-6">
      <div className="flex flex-col items-center gap-4">
        <KeywordToken 
            keyword={result.whatsappKeyword} 
            color={branchColor} 
            size="large" 
            interactive={true} 
        />
        <p className="text-white/30 text-xs text-center uppercase tracking-widest font-medium">
            Text this to unlock full protocol
        </p>
      </div>

      <motion.a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onCTA}
        className="flex items-center justify-center gap-3 w-full py-6 px-8 
                   rounded-full font-black text-2xl text-black
                   hover:brightness-110 active:scale-[0.98] transition-all duration-300 uppercase tracking-[0.2em]"
        style={{ backgroundColor: branchColor, boxShadow: `0 0 50px ${branchColor}40` }}
        whileHover={{ y: -2 }}
      >
        {result.whatsappKeyword}
      </motion.a>

      {!isAuthenticated && (
        <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
          Save your results →{' '}
          <Link href="/signup" className="text-white/60 hover:text-white underline underline-offset-4 transition-colors">
            Create Intelligence Profile
          </Link>
        </p>
      )}
    </div>
  );
}

function UrgencyIndicator({ urgency, color }: { urgency: ScoreLevel; color: string }) {
  const labels = {
    critical: 'Immediate Action Required',
    high: 'High Priority Optimization', 
    medium: 'Room for Improvement',
    low: 'Well Calibrated System'
  };

  return (
    <div
      className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest"
      style={{ backgroundColor: `${color}15`, color, border: `1.5px solid ${color}30` }}
    >
      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
      {labels[urgency]}
    </div>
  );
}

function DeepDiveSection({ deepDive, branchColor }: { deepDive: DeepDive; branchColor: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-16"
    >
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-6 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all group"
        style={{ borderColor: open ? `${branchColor}40` : undefined }}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🔬</span>
          <span className="text-sm font-black uppercase tracking-widest text-white/60 group-hover:text-white/80 transition-colors">
            Deep Dive
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-white/30 group-hover:text-white/50 transition-colors"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-8">

              {/* Why this happens */}
              <div className="px-6 py-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: branchColor }}>
                  Why This Happens
                </p>
                <p className="text-white/60 text-sm leading-relaxed">{deepDive.why}</p>
              </div>

              {/* Common mistakes */}
              <div className="px-6 py-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-white/40">
                  What Most People Get Wrong
                </p>
                <ul className="space-y-3">
                  {deepDive.mistakes.map((mistake, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/50 leading-relaxed">
                      <span className="text-white/20 flex-shrink-0 mt-0.5">✕</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline */}
              <div
                className="px-6 py-5 rounded-2xl border"
                style={{ backgroundColor: `${branchColor}08`, borderColor: `${branchColor}20` }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: branchColor }}>
                  What to Expect
                </p>
                <p className="text-white/60 text-sm leading-relaxed">{deepDive.timeline}</p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
