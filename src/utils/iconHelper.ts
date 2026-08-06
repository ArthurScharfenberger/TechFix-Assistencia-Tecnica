import { createIcons, icons } from 'lucide';

export function initIcons(container?: HTMLElement | Document): void {
  createIcons({
    icons,
    nameAttr: 'data-lucide',
    attrs: {
      class: 'lucide-icon',
      width: '18',
      height: '18',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    ...(container ? { root: container as HTMLElement } : {}),
  });
}

export function iconHTML(name: string, extraClass: string = '', size: number = 18): string {
  return `<i data-lucide="${name}" class="${extraClass}" style="width: ${size}px; height: ${size}px; display: inline-block; vertical-align: middle;"></i>`;
}
