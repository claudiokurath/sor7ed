// components/BranchGrid.tsx
'use client';

import { SORTED_ECOSYSTEM_BRANCHES, BranchKey } from '@/lib/unified-branches';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BranchGridProps {
  toolCounts?: Partial<Record<BranchKey, number>>;
}

export function BranchGrid({ toolCounts = {} }: BranchGridProps) {
  const branches = Object.values(SORTED_ECOSYSTEM_BRANCHES);

  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          The 7 branches of chaos
        </h2>
        <p className="text-lg text-white/60 max-w-2xl">
          These are the seven places life tends to fall apart. None of them mean you're broken. 
          They just tell us where to start building scaffolding.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((branch, index) => {
          const count = toolCounts[branch.id as BranchKey] ?? 0;
          
          return (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <Link href={`/tools?branch=${branch.id}`}>
                <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 cursor-pointer">
                  {/* Color accent */}
                  <div 
                    className="h-1 w-full"
                    style={{ backgroundColor: branch.color }}
                  />
                  
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: branch.color,
                            boxShadow: `0 0 8px ${branch.color}33`
                          }}
                        />
                        <span className="text-sm font-semibold text-white uppercase tracking-wider">
                          {branch.label}
                        </span>
                      </div>
                      
                      {count > 0 && (
                        <span className="text-xs text-white/40">
                          {count} diagnostic{count !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Tagline */}
                    <p className="text-base font-medium text-white/90 leading-snug">
                      {branch.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-white/60 leading-relaxed">
                      {branch.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-xs text-white/40">
                        Tap to explore this branch
                      </span>
                      <div 
                        className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: branch.color }}
                      >
                        <span>Open</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
