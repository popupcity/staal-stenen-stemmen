import { defineCollection, z } from 'astro:content';

const verhalenSchema = z.object({
  title: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  audio: z.string(),
  images: z.array(z.string()),
});

const verhalen = defineCollection({
  schema: verhalenSchema,
});

export const collections = {
  verhalen,
};
