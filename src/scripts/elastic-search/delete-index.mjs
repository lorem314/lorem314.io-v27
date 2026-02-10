import { client } from "@/lib/elasticsearch"

async function main() {
  await client.indices.delete({ index: "my_first_es_index" })
}

main()
