import type { Component } from 'vue'
import AdSquare from '../components/AdSquare.vue'

export interface AdConfig {
  name: string
  slug: string
  width: number
  height: number
  component: Component
}

export const Ads: AdConfig[] = [
  { name: 'Square Ad', slug: 'square', width: 1000, height: 800, component: AdSquare },
]

export function adFilename(ad: AdConfig): string {
  return `ftrb-ad-${ad.slug}-${ad.width}x${ad.height}.png`
}
