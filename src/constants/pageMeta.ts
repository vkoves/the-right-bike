/**
 * Meta titles and descriptions for supplementary pages.
 *
 * The source of truth is pageMeta.json (shared with the build-time prerender
 * script). This module re-exports it with types for use in Vue components.
 */
import meta from './pageMeta.json';

export const SiteName = meta.siteName;
export const PageMeta: Record<string, { title: string; description: string }> = meta.pages;
