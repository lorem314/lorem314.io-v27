import path from "path"
import {
  defineCollections,
  frontmatterSchema,
  defineConfig,
  defineDocs,
} from "fumadocs-mdx/config"
// import { remarkHeading } from "fumadocs-core/mdx-plugins"
import { remarkImage } from "fumadocs-core/mdx-plugins"
import {
  remarkCodeHike,
  recmaCodeHike,
  type CodeHikeConfig,
} from "codehike/mdx"
import { z } from "zod"

export const blogPostDocs = defineDocs({
  dir: "content/blog-post",
})

export const blogPostCollections = defineCollections({
  type: "doc",
  dir: "content/blog-post",
  schema: frontmatterSchema.extend({
    title: z.string(),
    tags: z.array(z.string()),
    createdAt: z.string(),
    summary: z.string().default(""),
  }),
})

export const booksDocs = defineDocs({
  dir: "content/books",
  docs: {
    schema: z.object({
      isbn: z.string(),
      title: z.string(),
      chapter: z.number(),
    }),
  },
  meta: {
    schema: z.object({
      title: z.string(),
      subtitle: z.string(),
      isbn: z.string(),
    }),
  },
})

export const blogsDocs = defineDocs({
  dir: "content/blogs",
  docs: {
    schema: z.object({
      title: z.string(),
      tags: z.array(z.string()),
      createdAt: z.string(),
      type: z.string().default("post"),
      summary: z.string().default(""),
    }),
  },
})

const chConfig: CodeHikeConfig = {
  components: {
    code: "CodeHikePre",
  },
}

export default defineConfig({
  mdxOptions: {
    remarkPlugins: (v) => [
      [remarkCodeHike, chConfig],
      // remarkHeading,
      ...v,
      [
        remarkImage,
        {
          useImport: false,
          // publicDir: path.join(process.cwd(), "public"),
        },
      ],
    ],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
})
