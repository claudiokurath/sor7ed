"use client";

import React from 'react';

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '447591922247';

type ButtonProps = {
  command: string;        // "SAVE tool-slug", "RUN tool-slug", etc.
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline';
  className?: string;
  phone?: string;
};

function buildWaMeUrl(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function GetSor7edButton({
  command,
  label = 'GET IT SOR7ED',
  size = 'md',
  variant = 'primary',
  className = '',
  phone = WA_NUMBER,
}: ButtonProps) {
  const href = buildWaMeUrl(phone, command);
  
  // Use existing design system classes
  const baseClass = variant === 'primary' ? 'btn-yellow' : 'btn-outline';
  const sizeClass = {
    sm: 'text-[10px] px-4 py-2',
    md: 'text-xs px-6 py-3', 
    lg: 'text-sm px-8 py-4',
  }[size];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${sizeClass} text-center`}
        aria-label={`${label} — Opens WhatsApp with ready message`}
      >
        <span className="mr-2" aria-hidden="true">💬</span>
        {label}
      </a>
      <p className="text-[9px] font-display uppercase tracking-widest text-black/40 text-center">
        Opens WhatsApp with ready message
      </p>
    </div>
  );
}

// Convenience wrappers for common use cases
export function SaveToolButton({ 
  toolSlug, 
  ...props 
}: Omit<ButtonProps, 'command'> & { toolSlug: string }) {
  return <GetSor7edButton command={`SAVE ${toolSlug}`} {...props} />;
}

export function RunToolButton({ 
  toolSlug, 
  ...props 
}: Omit<ButtonProps, 'command'> & { toolSlug: string }) {
  return <GetSor7edButton command={`RUN ${toolSlug}`} {...props} />;
}

export function SaveArticleButton({ 
  articleSlug, 
  ...props 
}: Omit<ButtonProps, 'command'> & { articleSlug: string }) {
  return <GetSor7edButton command={`ARTICLE ${articleSlug}`} {...props} />;
}
