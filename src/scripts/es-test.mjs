// import { Client } from "@elastic/elasticsearch"

import { client } from "@/lib/elasticsearch"

// const client = new Client({
//   node: "http://localhost:9200",
// })

async function main() {
  // 检查信息
  const resp = await client.info()
  console.log("resp", resp)

  // 删除索引
  // await client.indices.delete({ index: "my_first_es_index" })

  // 创建索引
  // await client.indices.create({ index: "my_first_es_index" })
  // await client.indices.create({
  //   index: "my_first_es_index",
  //   mappings: {
  //     properties: {
  //       id: { type: "keyword" },
  //       title: { type: "text" },
  //       tags: { type: "keyword" },
  //       content: { type: "text" },
  //     },
  //   },
  // })

  // 插入文档 bulk
  // const result = await client.helpers.bulk({
  //   refresh: true,
  //   datasource: blogPosts,
  //   onDocument: (doc) => {
  //     return {
  //       index: {
  //         _index: "my_first_es_index",
  //         _id: doc.id,
  //       },
  //     }
  //   },
  // })
  // console.log(result)

  // 搜索
  // const searchResult = await client.search({
  //   index: "lorem314.io-v27",
  //   query: {
  //     terms: {
  //       tags: ["Next.js"],
  //     },
  //   },
  //   _source: ["title", "tags", "createdAt", "summary"],
  //   // highlight: {
  //   //   // 定义高亮标签，默认是 <em>，你可以自定义为前端样式的 class
  //   //   pre_tags: ["<mark class='highlight'>"],
  //   //   post_tags: ["</mark>"],
  //   //   fields: {
  //   //     content: {
  //   //       fragment_size: 7, // 每个片段包含的字符数（包含上下文）
  //   //       number_of_fragments: 3, // 最多返回几个匹配的片段
  //   //       no_match_size: 7, // 如果没有匹配到，默认显示的字符数
  //   //     },
  //   //     title: {
  //   //       fragment_size: 0, // 设为 0 表示返回完整的标题
  //   //       number_of_fragments: 1,
  //   //     },
  //   //   },
  //   // },
  // })
  // console.log(
  //   "searchResult ",
  //   JSON.stringify(searchResult.hits.hits, undefined, 2),
  // )

  //
}

main().catch((error) => {
  console.log("error", error)
})

/**
{
  total: 6,
  failed: 0,
  retry: 0,
  successful: 6,
  noop: 0,
  time: 82,
  bytes: 1273,
  aborted: false
}
*/
