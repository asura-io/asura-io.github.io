import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    order: z.number().default(0),
    active: z.boolean().default(false),
    cover: image().optional()
  })
});

const bio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bio' }),
  schema: z.object({}).passthrough()
});

const cv = defineCollection({
  loader: file('./src/content/cv.yaml'),
  schema: z.object({
    order: z.number().default(0),
    heading: z.string(),
    entries: z.array(z.object({
      year: z.string(),
      title: z.string().optional(),
      detail: z.string()
    }))
  })
});

export const collections = { series, bio, cv };
