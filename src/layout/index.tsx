import type { Report } from '@/domain/report';
import { createContext, useContext } from 'react';

export type LayoutContext = {
  filename: string;
  report: Report;
};

export const LayoutContext = createContext<unknown>(null);
export function useLayout(): LayoutContext {
  return useContext(LayoutContext) as LayoutContext;
}
