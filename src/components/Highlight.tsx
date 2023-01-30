import type { HTMLAttributes, ReactNode } from 'react';

type HighlightProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function Highlight({
  children,
  className = '',
  ...props
}: HighlightProps) {
  return (
    <strong {...props} className={`text-black ${className}`}>
      {children}
    </strong>
  );
}
