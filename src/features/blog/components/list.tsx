"use client"

import React from "react"
import Link from "next/link"
import { DotIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  ItemGroup,
  ItemHeader,
  ItemFooter,
} from "@/components/ui/item"
import { Paginator } from "@/components/ui/paginator"

import { fetchBlogs } from "../data"
import { useContext } from "./context"
import { BlogPost, Tag } from "@/types"

export function List({
  allBlogPosts,
  query,
}: {
  allBlogPosts: BlogPost[]
  query: { searchTerm: string; selectedTags: Tag[]; currentPage: number }
}) {
  const { pageSize, setCurrentPage } = useContext()

  const { blogPosts, totalPage } = React.use<{
    blogPosts: BlogPost[]
    totalPage: number
  }>(
    fetchBlogs(allBlogPosts, {
      searchTerm: query.searchTerm,
      selectedTags: query.selectedTags,
      currentPage: query.currentPage,
      pageSize,
    }),
  )

  if (blogPosts.length === 0) {
    return <NotFound />
  }

  return (
    <>
      <ItemGroup className="gap-4">
        {blogPosts.map((item) => {
          return (
            <Item key={item.id} asChild>
              <Link
                className="text-link group hover:no-underline"
                href={item.url}
              >
                <ItemHeader>
                  <ItemTitle>
                    <span className="font-bold hover:underline">
                      {item.title}
                    </span>
                    <DotIcon className="text-muted-foreground size-2.5" />
                    <span className="text-muted-foreground">
                      {item.createdAt}
                    </span>
                  </ItemTitle>
                </ItemHeader>
                <ItemContent>
                  <ul className="flex flex-wrap items-center gap-2.5">
                    {item.tags.map((tag, index) => {
                      return (
                        <Badge
                          key={index}
                          asChild
                          className="rounded"
                          variant="secondary"
                        >
                          <li>{tag}</li>
                        </Badge>
                      )
                    })}
                  </ul>
                  {item.summary && (
                    <ItemDescription className="mt-3 line-clamp-none">
                      {item.summary}
                    </ItemDescription>
                  )}
                </ItemContent>
              </Link>
            </Item>
          )
        })}
      </ItemGroup>
      <Paginator
        className="mt-6"
        currentPage={query.currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPage}
      />
    </>
  )
}

function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        {/* <EmptyMedia variant="icon"></EmptyMedia> */}
        <EmptyTitle className="text-muted-foreground">
          没有符合查询的文章...
        </EmptyTitle>
        {/* <EmptyDescription></EmptyDescription> */}
      </EmptyHeader>
    </Empty>
  )
}
