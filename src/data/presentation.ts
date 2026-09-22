import type { ImageMetadata } from 'astro';

const assets = import.meta.glob<{ default: ImageMetadata }>('../assets/images/**/*.{jpg,jpeg,JPG,png}', { eager: true });
const image = (path: string) => assets[`../assets/images/${path}`].default;
export interface ArtworkView {
  image: ImageMetadata;
  kind: 'work' | 'detail' | 'installation';
}
const view = (path: string, kind: ArtworkView['kind'] = 'work'): ArtworkView => ({ image: image(path), kind });
export const seriesOrder = ['bodhisattva', 'asiatic', 'contextual-modernism', 'american-vedas'];
export const presentation: Record<string, { cover: ImageMetadata[]; groups: ArtworkView[][] }> = {
  bodhisattva: {
    cover: [image('bodhisattva/G-3-5.jpeg')],
    groups: [
      [view('bodhisattva/G-3-5.jpeg', 'installation')],
      [view('bodhisattva/G-2.jpeg', 'installation')],
      [view('bodhisattva/G-3-1.jpeg', 'installation'), view('bodhisattva/G-3-2.jpeg', 'installation')],
      [view('bodhisattva/bodhisattva_I_ful.jpg'), view('bodhisattva/P4020006_copy.jpg')],
      [view('bodhisattva/P4020003.JPG', 'detail'), view('bodhisattva/P4020011.JPG', 'detail')],
      [view('bodhisattva/P4020015_copy.jpg'), view('bodhisattva/P4020018.JPG')],
      [view('bodhisattva/P4020017.JPG', 'detail'), view('bodhisattva/P4020022.JPG', 'detail')],
    ],
  },
  'contextual-modernism': {
    cover: [image('contextual-modernism/P1011099-gallery-lighting-v3.png')],
    groups: [[view('contextual-modernism/P1011099-gallery-lighting-v3.png', 'installation')]],
  },
  asiatic: {
    cover: [image('asiatic/asiatic-straight-v6.png')],
    groups: [[view('asiatic/asiatic-straight-v6.png', 'installation')]],
  },
  'american-vedas': {
    cover: [image('american-vedas/three_with_chair-a969efd9d0dfb70e335e541559ad8c26.jpg')],
    groups: [
      [view('american-vedas/three_with_chair-a969efd9d0dfb70e335e541559ad8c26.jpg', 'installation')],
      [view('american-vedas/Gautham-Acharya---Shiva-Sumi-Ink-30x40.jpg')],
      [view('american-vedas/Ganesha-Gautham-Acharya-18x24.jpg'), view('american-vedas/Old-Man-18x24.jpg')],
    ],
  },
};
