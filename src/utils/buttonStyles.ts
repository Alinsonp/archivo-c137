import { cx } from './cx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold ' +
  'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-crimson text-white hover:bg-crimson-hover',
  secondary: 'border border-line bg-surface text-ink hover:border-gold',
  ghost: 'text-ink hover:bg-surface-2',
}

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 text-base',
  lg: 'min-h-12 px-7 text-lg',
}

/** Clases compartidas por `<button>` y `<Link>` para que ambos luzcan igual. */
export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md'): string {
  return cx(base, variants[variant], sizes[size])
}
