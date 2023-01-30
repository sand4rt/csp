import type { HTMLAttributes, ReactNode } from 'react';

type DescriptionProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLParagraphElement>;

export function Description({
  children,
  className = '',
  ...props
}: DescriptionProps) {
  return (
    <p
      className={`mx-6 mt-4 mb-8 text-center text-base text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
