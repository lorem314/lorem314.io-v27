import "dotenv/config"

import { Client } from "@elastic/elasticsearch"
import { isDev, isProd } from "./env"

const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE
const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD

if (!isDev) {
  if (!ELASTICSEARCH_NODE) {
    throw new Error("环境变量 ELASTICSEARCH_NODE 未设置")
  }
  if (!ELASTICSEARCH_USERNAME) {
    throw new Error("环境变量 ELASTICSEARCH_USERNAME 未设置")
  }
  if (!ELASTICSEARCH_PASSWORD) {
    throw new Error("环境变量 ELASTICSEARCH_PASSWORD 未设置")
  }
}

const client = new Client({
  node: ELASTICSEARCH_NODE,
  auth: isDev
    ? { apiKey: "" }
    : {
        username: ELASTICSEARCH_USERNAME!,
        password: ELASTICSEARCH_PASSWORD!,
      },
  tls: {
    rejectUnauthorized: !isDev,
  },
})

export { client }

// client.indices.create({
//   index: "",
//   settings: {
//     number_of_shards: 1,
//     number_of_replicas: 0,
//     analysis: {
//       analyzer: {
//         ngram_analyzer: {
//           type: "custom",
//           tokenizer: "my_ngram_tokenizer",
//           filter: ["lowercase"],
//         },
//       },
//       tokenizer: {
//         my_ngram_tokenizer: {
//           type: "ngram",
//           min_gram: 3,
//           max_gram: 8,
//           token_chars: ["letter", "digit"],
//         },
//       },
//     },
//   },
//   mappings: {
//     properties: {
//       title: {
//         type: "text",
//         fields: {
//           keyword: { type: "keyword" },
//           ngram: {
//             type: "text",
//             analyzer: "ngram_analyzer",
//             search_analyzer: "standard",
//           },
//         },
//       },
//     },
//   },
// })
