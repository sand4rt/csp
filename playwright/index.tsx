import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import { MemoryRouter } from 'react-router-dom';
import { LayoutContext } from '@/layout';
import '@/main.css';

export type HooksConfig = {
  layoutContext?: Partial<LayoutContext>;
};

beforeMount<HooksConfig>(({ App, hooksConfig }) => {
  return Promise.resolve(
    <MemoryRouter>
      <LayoutContext.Provider value={hooksConfig?.layoutContext ?? null}>
        <App />
      </LayoutContext.Provider>
    </MemoryRouter>
  );
});
