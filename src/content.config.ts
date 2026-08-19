import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Weak Signals — the newsletter archive.
 * One markdown file per issue in src/content/blog/. Filename becomes the URL:
 * src/content/blog/my-post.md → /blog/my-post
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences — shown on cards, in search results and RSS. */
    description: z.string(),
    pubDate: z.coerce.date(),
    /** Link to the original LinkedIn newsletter issue, if there is one. */
    linkedin: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    /** Card color; cycles through the palette when omitted. */
    color: z.enum(['lime', 'sunflower', 'magenta', 'cobalt', 'tangerine', 'violet']).optional(),
    /** draft: true keeps it out of the build. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
