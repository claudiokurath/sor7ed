import Image from 'next/image';
import Link from 'next/link';

interface VisualCardProps {
  title: string;
  category: string;
  subtitle?: string;
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
  imageUrl,
  fallbackColor = '#EBA904',
  href,
  aspectRatio = 'tool',
  priority = false,
}: VisualCardProps) {
  return (
    <Link href={href} className="group block w-full">
      <div className={`
        relative w-full ${ASPECT[aspectRatio]}
        rounded-2xl overflow-hidden bg-surface-card
        border border-surface-border
        transition-all duration-300
        group-hover:border-brand-amber group-hover:shadow-brand-glow
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
                ? '100vw'
                : '(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 350px'
            }
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${fallbackColor}28 0%, #0A0A0F 100%)` }}
          >
            <span className="font-display text-7xl opacity-10 uppercase" style={{ color: fallbackColor }}>
              {category[0]}
            </span>
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-surface-glass backdrop-blur-md text-brand-amber border border-brand-amber/30">
            {category}
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-sm uppercase tracking-wide text-text-primary leading-tight mb-1 line-clamp-2 group-hover:text-brand-amber transition-colors duration-200">
            {title}
          </h3>
          {subtitle && (
            <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
