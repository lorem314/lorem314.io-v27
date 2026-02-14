import { notFound } from "next/navigation"

import { blogsSource } from "@/lib/source"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { Layout } from "@/components/article/layout"
import { components } from "@/components/article/components"
import { Scrollycoding } from "@/components/article/scrollycoding"

export default async function Page(props: {
  params: Promise<{ title: string }>
}) {
  const params = await props.params
  const blogPost = blogsSource.getPage([params.title])

  if (!blogPost) return notFound()

  if (blogPost.data.type === "scrollycoding") {
    // console.log("blogPost", blogPost)
    // return <div>scrollycoding</div>
    return <Scrollycoding blogPost={blogPost} />
  }

  return (
    <Layout title={blogPost.data.title} toc={blogPost.data.toc}>
      <header className="mx-auto mb-12 max-w-prose">
        <h1 className="text-4xl font-bold">{blogPost.data.title}</h1>

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          {blogPost.data.tags.map((tag, index) => {
            return (
              <Badge
                key={index}
                className="rounded-lg px-2.5 py-1.5 text-sm"
                variant="outline"
              >
                {tag}
              </Badge>
            )
          })}
        </div>

        <div className="text-muted-foreground my-4">2025 年 12 月 12 日</div>
      </header>

      <section
        className={cn(
          "prose prose-slate dark:prose-invert mx-auto mt-8",
          // "lg:prose-lg",
        )}
      >
        <p className="lead">{blogPost.data.summary}</p>
        <blogPost.data.body components={components} />
        {/* <Article /> */}
      </section>

      {/* <footer className="mx-auto mt-16 max-w-prose">相关文章链接</footer> */}
    </Layout>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ title: string }>
}) {
  const params = await props.params
  const blogPost = blogsSource.getPage([params.title])

  if (!blogPost) return {}

  return {
    title: `${blogPost.data.title} | 博客 | lorem314.io-v18`,
  }
}
