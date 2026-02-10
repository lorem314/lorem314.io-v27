import Link from "next/link"
import { notFound } from "next/navigation"
import type * as PageTree from "fumadocs-core/page-tree"
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { booksSource } from "@/lib/source"
import { Layout } from "@/components/article/layout"
import { components } from "@/components/article/components"

export default async function Page(props: {
  params: Promise<{ title: string; chapter: string }>
}) {
  const params = await props.params
  // console.log("params", params)

  // const pages = booksSource.getPages()
  // console.log("pages", pages)

  const page = booksSource.getPage([params.title, params.chapter])
  console.log("page", page)

  if (!page) return notFound()

  const pageTree = booksSource.getPageTree()
  console.log("pageTree", pageTree)

  const bookNode = pageTree.children.find((node) => {
    const nodeName = node.name as string
    return (
      node.type === "folder" &&
      nodeName.replaceAll(" ", "") === decodeURI(params.title)
    )
  })

  if (!bookNode || bookNode.type !== "folder") {
    return notFound()
  }

  // console.log("toc", page.data.toc)

  const prevChapter =
    page.data.chapter <= 1
      ? null
      : bookNode.children.find((chapter) => {
          return chapter.$id?.includes(`第${page.data.chapter - 1}章`)
        })

  const nextChapter = bookNode.children.find((chapter) => {
    return chapter.$id?.includes(`第${page.data.chapter + 1}章`)
  })

  if (prevChapter && prevChapter.type !== "page") return notFound()
  if (nextChapter && nextChapter.type !== "page") return notFound()

  console.log("prevChapter", prevChapter)
  console.log("nextChapter", nextChapter)

  return (
    <Layout title={page.data.title} toc={page.data.toc}>
      <header className="mx-auto mb-12 max-w-prose">
        <h1 className="text-right text-4xl font-bold">
          <span>第 {page.data.chapter} 章</span>
          <Separator orientation="horizontal" className="my-4" />
          <span>{page.data.title}</span>
        </h1>

        {/* <div className="mt-8 flex flex-wrap items-center gap-2.5">
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
        </div> */}

        {/* <div className="text-muted-foreground my-4">2025 年 12 月 12 日</div> */}
      </header>

      <section
        className={cn(
          "prose prose-slate dark:prose-invert mx-auto mt-8",
          // "lg:prose-lg",
        )}
      >
        {/* <p className="lead">{page.data.summary}</p> */}
        <page.data.body components={components} />
        {/* <Article /> */}
      </section>

      {/* {(!prevChapter || prevChapter.type !== "page") &&
      (!nextChapter || nextChapter.type !== "page") ? null : (
        <footer>
          <div></div>
          <div></div>
        </footer>
      )} */}

      <footer className="mx-auto mt-16 flex flex-col gap-4 md:flex-row md:justify-between">
        <Item asChild variant={prevChapter ? "outline" : "muted"}>
          {prevChapter ? (
            <Link
              href={prevChapter?.url || ""}
              className="grow flex-row-reverse hover:no-underline"
            >
              <ItemContent className="items-end">
                <ItemTitle>上一章</ItemTitle>
                <ItemDescription>
                  {prevChapter?.name || "没有了"}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronLeftIcon className="size-4" />
              </ItemActions>
            </Link>
          ) : (
            <div className="grow flex-row-reverse hover:no-underline">
              <ItemContent className="items-end">
                <ItemTitle>上一章</ItemTitle>
                <ItemDescription>没有了</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronLeftIcon className="size-4" />
              </ItemActions>
            </div>
          )}
        </Item>

        <Item asChild variant={nextChapter ? "outline" : "muted"}>
          {nextChapter ? (
            <Link
              href={nextChapter?.url || ""}
              className="grow hover:no-underline"
            >
              <ItemContent>
                <ItemTitle>下一章</ItemTitle>
                <ItemDescription>{nextChapter?.name}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon className="size-4" />
              </ItemActions>
            </Link>
          ) : (
            <div className="grow hover:no-underline">
              <ItemContent>
                <ItemTitle>下一章</ItemTitle>
                <ItemDescription>没有了</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon className="size-4" />
              </ItemActions>
            </div>
          )}
        </Item>
      </footer>
    </Layout>
  )
}
