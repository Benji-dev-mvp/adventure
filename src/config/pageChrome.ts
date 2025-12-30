import { PageScaffoldConfig } from '@/components/layout/OperatorShell';
import { ROUTE_DEFINITIONS } from './routeDefinitions';

export type PageChromeMode = 'shell' | 'plain';

interface PageChromeRule {
  paths: string[];
  config: PageScaffoldConfig;
  mode?: PageChromeMode;
}
const rules: PageChromeRule[] = Object.values(ROUTE_DEFINITIONS).map(route => ({
  paths: [route.path, ...(route.altPaths || [])],
  config: {
    title: route.chrome?.title || route.label,
    subtitle: route.chrome?.subtitle || route.description,
    badges: route.chrome?.badges || (route.badge ? [route.badge] : undefined),
  },
  mode: route.chrome?.mode,
}));

const defaultConfig: PageScaffoldConfig = {
  title: 'Workspace',
  subtitle: 'Unified operator console',
};

export function resolvePageChrome(pathname: string, fallbackTitle?: string) {
  const rule = rules.find(r => r.paths.some(p => pathname.startsWith(p)));
  const title = rule?.config.title || fallbackTitle || defaultConfig.title;
  const scaffold: PageScaffoldConfig = {
    ...defaultConfig,
    ...rule?.config,
    title,
  };

  return {
    scaffold,
    mode: rule?.mode || 'shell',
  } as const;
}
