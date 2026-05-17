import Image from 'next/image';
import Link from 'next/link';

interface VisualCardProps {
  title: string;
  category: string;
  subtitle?: string;
  readTime?: string;
  imageUrl?: string | null;
  fallbackColor?: string;
  href: string;
  aspectRatio?: 'tool' | 'blog' | 'featured';
  priority?: boolean;
}

const ASPECT: Record<string, string> = {
  tool:     'aspect-[3/4]',
  blog:     'aspect-[16/9]',
  featured: 'aspect-[21/9]',
};

export default function VisualCard({
  title,
  category,
  subtitle,
  readTime,
  imageUrl,
  fallbackColor = '#FFD107',
  href,
  aspectRatio = 'tool',
  priority = false,
}: VisualCardProps) {
  return (
    <Link href={href} className="group block w-full">
      <div className={`
        relative w-full ${ASPECT[aspectRatio]}
        border-2 border-ps-white overflow-hidden
        transition-all duration-200
        hover:border-ps-yellow hover:shadow-hard-yellow
        active:scale-[0.98]
      `}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={
              aspectRatio === 'featured'
                ? '(max-width: 768px) 100vw, 80vw'
                : '(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 350px'
            }
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-ps-black"
            style={{ background: `linear-gradient(135deg, ${fallbackColor}20 0%, #000000 100%)` }}
          >
            <span className="font-display text-7xl opacity-10 uppercase" style={{ color: fallbackColor }}>
              {category[0]}
            </span>
          </div>
        )}

        {/* Hard gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ps-black via-ps-black/50 to-transparent" />

        {/* Category badge — yellow on black, hard edges */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-1 bg-ps-yellow text-ps-black text-[9px] font-display uppercase tracking-[0.15em] border-2 border-ps-black">
            {category}
          </span>
        </div>

        {readTime && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2.5 py-1 bg-ps-black border-2 border-ps-white text-ps-white text-[9px] font-display uppercase tracking-wider">
              {readTime}
            </span>
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-ps-white text-sm md:text-base uppercase tracking-wide leading-tight mb-1.5 line-clamp-2 group-hover:text-ps-yellow transition-colors duration-200">
            {title}
          </h3>
          {subtitle && (
            <p className="text-ps-white/70 text-xs leading-relaxed line-clamp-2">
              {subtitle}
            </p>
          )}
          {/* Hover CTA */}
          <div className="mt-2 flex items-center gap-1.5 text-ps-yellow text-[10px] font-display uppercase tracking-widest opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            EXPLORE
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
