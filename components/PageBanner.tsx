interface PageBannerProps {
  src: string
  alt?: string
}

export default function PageBanner({ src, alt = '' }: PageBannerProps) {
  return (
    <div className="relative w-full h-40 md:h-52 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
    </div>
  )
}
