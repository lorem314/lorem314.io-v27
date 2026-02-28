import { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import z from "zod"

import { createTRPCRouter } from "../init"
import { publicProcedure } from "../init"

import { client as esClient } from "@/lib/elasticsearch"

export const appRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return { message: "hello", time: new Date() }
  }),
  search: publicProcedure
    .input(
      z.object({
        search: z.string(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts

      const result = await esClient.search<{
        title: string
        tags: string[]
        createdAt: Date
        summary: string
      }>({
        index: "lorem314.io-v27_blogs",
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: input.search,
                  fields: [
                    "title.ngram^3",
                    "summary.ngram^2",
                    "content.ngram^1",
                  ],
                  type: "best_fields",
                  fuzziness: 0,
                  prefix_length: 2,
                  max_expansions: 20,
                  minimum_should_match: "75%",
                },
              },
              {
                wildcard: {
                  "title.wildcard": { value: `*${input.search}*` },
                },
              },
              {
                wildcard: {
                  "summary.wildcard": { value: `*${input.search}*` },
                },
              },
              {
                wildcard: {
                  "content.wildcard": { value: `*${input.search}*` },
                },
              },
            ],
          },
        },
        _source: ["title", "tags", "createdAt", "summary"],
        highlight: {
          pre_tags: ["<mark>"],
          post_tags: ["</mark>"],
          type: "unified",
          fields: {
            "title.ngram": {
              fragment_size: 50,
              number_of_fragments: 1,
            },
            "summary.ngram": {
              fragment_size: 150,
              number_of_fragments: 2,
              no_match_size: 150,
            },
            "content.ngram": {
              fragment_size: 150,
              number_of_fragments: 3,
              no_match_size: 0,
            },
          },
        },
      })

      // console.log("result", result)

      return { result }
    }),
})

export type AppRouter = typeof appRouter

export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
