import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    series: z.string(),
    year: z.union([z.string(), z.number()]).optional(),
    medium: z.string().optional(),
    dimensions: z.string().optional(),
    image: image(),
    images: z.array(image()).optional(),
    order: z.number().default(0),
    featured: z.boolean().default(false)
  })
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    order: z.number().default(0),
    active: z.boolean().default(false),
    cover: image().optional()
  })
});

export const collections = { work, series };
