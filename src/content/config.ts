import { defineCollection, z } from 'astro:content';

const issuesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:      z.string(),
    trackName:  z.string().optional(),
    artist:     z.string().optional(),
    issueNumber: z.number(),
    date:       z.coerce.date(),
    theme:      z.string(),
    description: z.string(),
    coverImage:  z.string().optional().default(''),
    spotifyEmbedUrl: z.string().optional(),
    tags:       z.array(z.string()).optional().default([]),
    draft:      z.boolean().optional().default(false),
  }),
});

export const collections = { issues: issuesCollection };
