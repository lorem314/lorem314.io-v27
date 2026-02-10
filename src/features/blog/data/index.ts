import type { Tag, BlogPost } from "@/types"

const cache = new Map()

type Query = {
  searchTerm: string
  selectedTags: Tag[]
  pageSize: number
  currentPage: number
}

export function fetchBlogs(data: BlogPost[], query: Query) {
  const searchParams = new URLSearchParams({
    searchTerm: query.searchTerm,
    pageSize: query.pageSize.toString(),
    selectedTags: query.selectedTags
      .sort((prev, next) =>
        prev.name.localeCompare(next.name, undefined, { sensitivity: "base" }),
      )
      .map((tag) => tag.name)
      .join(","),
    currentPage: query.currentPage.toString(),
  })

  const key = searchParams.toString()

  if (!cache.has(key)) {
    // console.log("no cache", key)
    cache.set(key, getData(data, query))
  }

  return cache.get(key)
}

async function getData(data: BlogPost[], query: Query) {
  return await getSearchResults(data, query)
}

async function getSearchResults(data: BlogPost[], query: Query) {
  await new Promise((resolve) => {
    setTimeout(resolve, 0)
  })

  if (query.searchTerm == "") {
    const results = data.filter((blogPost) => {
      if (query.selectedTags.length === 0) return true
      return query.selectedTags
        .map((tag) => blogPost.tags.includes(tag.name))
        [true ? "some" : "every"]((b) => b)
    })

    return {
      blogPosts: results.slice(
        (query.currentPage - 1) * query.pageSize,
        query.currentPage * query.pageSize,
      ),
      currentPage: query.currentPage,
      totalPage: Math.ceil(results.length / query.pageSize),
    }
  }

  const results = data
    .filter((blogPost) => {
      return blogPost.title
        .toLowerCase()
        .includes(query.searchTerm.toLowerCase())
    })
    .filter((blogPost) => {
      if (query.selectedTags.length === 0) return true
      return query.selectedTags
        .map((tag) => blogPost.tags.includes(tag.name))
        [true ? "some" : "every"]((b) => b)
    })

  // console.log("results.length", results.length)
  // console.log("query.pageSize", query.pageSize)

  return {
    blogPosts: results.slice(
      (query.currentPage - 1) * query.pageSize,
      query.currentPage * query.pageSize,
    ),
    currentPage: query.currentPage,
    totalPage: Math.ceil(results.length / query.pageSize),
  }
}
