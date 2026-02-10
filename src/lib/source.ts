import { toFumadocsSource } from "fumadocs-mdx/runtime/server"
// import { createMDXSource } from "fumadocs-mdx/source"
import { loader } from "fumadocs-core/source"
import {
  blogPostCollections,
  blogPostDocs,
  // bookCovers,
  // bookChapters,
  booksDocs,
  blogsDocs,
} from "fumadocs-mdx:collections/server"

export const blogPostSource = loader({
  baseUrl: "/blogs",
  source: toFumadocsSource(blogPostCollections, []),
})

export const blogPostSource2 = loader({
  baseUrl: "/blogs",
  source: blogPostDocs.toFumadocsSource(),
})

export const booksSource = loader({
  baseUrl: "/books",
  source: booksDocs.toFumadocsSource(),
})

export const blogsSource = loader({
  baseUrl: "/blogs",
  source: blogsDocs.toFumadocsSource(),
})

// export const srcBookCovers = loader({
//   baseUrl: "/book-covers",
//   source: createMDXSource(bookCovers),
// })

// export const srcBookChapters = loader({
//   baseUrl: "/book-chapters",
//   source: createMDXSource(bookChapters),
// })
