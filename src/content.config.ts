// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Define your collection(s)
const verhalen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/verhalen' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    audio: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { verhalen };
