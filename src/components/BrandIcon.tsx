import { cn } from '@/lib/utils'

export interface BrandIconProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  alt?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 p-1.5 rounded-md',
  md: 'w-10 h-10 p-2 rounded-md',
  lg: 'w-14 h-14 p-2.5 rounded-lg',
} as const

export function BrandIcon({ className, size = 'md', alt = 'WYNTab' }: BrandIconProps) {
  return (
    <div
      className={cn(
        'bg-card border border-divider-bright flex items-center justify-center shrink-0 shadow-xs',
        sizeClasses[size],
        className
      )}
    >
      <img
        src="/icon/128.png"
        className="w-full h-full object-contain"
        alt={alt}
      />
    </div>
  )
}
