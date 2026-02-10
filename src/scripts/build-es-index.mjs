import { register } from "node:module"
import { client } from "@/lib/elasticsearch"

register("fumadocs-mdx/node/loader", import.meta.url)

const INDEX_NAME = "lorem314.io-v27"

async function main() {
  const { blogsDocs } = await import(".source/server.ts")

  const blogs = blogsDocs.docs.map((blog) => {
    // console.log("blog", blog)
    return {
      title: blog.title,
      tags: blog.tags,
      createdAt: new Date(blog.createdAt),
      summary: blog.summary,
      content: blog.structuredData.contents
        .map((content) => content.content)
        .join(" "),
    }
  })
  // console.log("blogs", blogs)

  // 检查索引是否存在
  const exists = await client.indices.exists({ index: `${INDEX_NAME}_blogs` })

  if (exists === true) {
    console.log(`索引 ${INDEX_NAME}_blogs 存在`)

    // 删除索引
    const deleteIndexResult = await client.indices.delete({
      index: `${INDEX_NAME}_blogs`,
    })
    console.log(`已删除索引 ${INDEX_NAME}_blogs`, deleteIndexResult)
  }

  // 创建索引
  const createIndexResult = await client.indices.create({
    index: `${INDEX_NAME}_blogs`,
    settings: {
      number_of_shards: 1,
      number_of_replicas: 0,
      "index.max_ngram_diff": 10,
      analysis: {
        analyzer: {
          ngram_analyzer: {
            type: "custom",
            tokenizer: "ik_smart",
            filter: ["lowercase", "edge_ngram_filter"],
          },
        },
        filter: {
          edge_ngram_filter: {
            type: "edge_ngram",
            min_gram: 1, // 从 2 开始，避免单字符碎片
            max_gram: 8,
          },
        },
      },
    },
    mappings: {
      properties: {
        title: {
          type: "text",
          analyzer: "ik_max_word",
          search_analyzer: "ik_smart",
          fields: {
            keyword: { type: "keyword" },
            ngram: {
              type: "text",
              analyzer: "ngram_analyzer",
              search_analyzer: "ik_smart",
              term_vector: "with_positions_offsets",
            },
            wildcard: { type: "wildcard" },
          },
        },
        tags: { type: "keyword" },
        createdAt: { type: "date" },
        summary: {
          type: "text",
          analyzer: "ik_max_word",
          search_analyzer: "ik_smart",
          fields: {
            ngram: {
              type: "text",
              analyzer: "ngram_analyzer",
              search_analyzer: "ik_smart",
              term_vector: "with_positions_offsets",
            },
            wildcard: { type: "wildcard" },
          },
        },
        content: {
          type: "text",
          analyzer: "ik_max_word",
          search_analyzer: "ik_smart",
          fields: {
            ngram: {
              type: "text",
              analyzer: "ngram_analyzer",
              search_analyzer: "ik_smart",
              term_vector: "with_positions_offsets",
            },
            wildcard: { type: "wildcard" },
          },
        },
      },
    },
  })
  console.log(`已创建索引 ${INDEX_NAME}_blogs`, createIndexResult)

  // 插入文档
  const insertResult = await client.helpers.bulk({
    refresh: true,
    datasource: blogs,
    onDocument: (blog) => {
      return {
        index: {
          _index: `${INDEX_NAME}_blogs`,
          _id: blog.title,
        },
      }
    },
  })
  console.log(`已为所有博客创建索引`, insertResult)

  // console.log(`${INDEX_NAME}`, result)

  // console.log(
  //   "blogsDocs",
  //   blogsDocs.docs.map((blog) => {
  //     return {
  //       title: blog.title,
  //       content: blog.structuredData.contents.map((item) => item.content),
  //     }
  //   }),
  // )
}

main()
