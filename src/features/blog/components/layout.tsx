"use client"

import React from "react"
import { TagsIcon } from "lucide-react"

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { ClientPortal } from "@/components/ui/client-portal"
import { useDrawer, Drawer } from "@/components/ui/drawer.legacy"

import { Search } from "./search"
import { Select } from "./select"
import { List } from "./list"
import { AllTags } from "./all-tags"
import { useContext } from "./context"
import type { BlogPost, Tag } from "@/types"

export function Layout({
  allTags,
  allBlogPosts,
}: {
  allTags: Tag[]
  allBlogPosts: BlogPost[]
}) {
  const { searchTerm, selectedTags, currentPage } = useContext()

  const isRightDrawerAlwaysCollapsed = false

  const {
    isCollapsed: isRightDrawerCollapsed,
    isOpen: isRightDrawerOpen,
    handler: rightDrawerHandler,
  } = useDrawer({
    isAlwaysCollapsed: isRightDrawerAlwaysCollapsed,
    mediaQuery: "(max-width: 64rem)",
  })

  const showRightDrawerOpener =
    isRightDrawerAlwaysCollapsed || isRightDrawerCollapsed

  const query = { searchTerm, selectedTags, currentPage }
  const deferredQuery = React.useDeferredValue(query)

  const isStale =
    searchTerm !== deferredQuery.searchTerm ||
    currentPage !== deferredQuery.currentPage ||
    JSON.stringify(selectedTags) !== JSON.stringify(deferredQuery.selectedTags)

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-12 gap-4">
      <Search />

      <Select allTags={allTags} />

      <Card className="col-span-full lg:col-span-7">
        <CardHeader>
          <CardTitle>博客列表</CardTitle>
        </CardHeader>
        <CardContent>
          <List allBlogPosts={allBlogPosts} query={deferredQuery} />
        </CardContent>
      </Card>

      {showRightDrawerOpener ? (
        <>
          <ClientPortal target="right-drawer-anchor">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={rightDrawerHandler.open}
            >
              <TagsIcon />
            </Button>
          </ClientPortal>
          <Drawer
            isOpen={isRightDrawerOpen}
            onClose={rightDrawerHandler.close}
            title="目录"
            side="right"
            size="420px"
          >
            {() => {
              return (
                <div className="p-2.5">
                  <AllTags allTags={allTags} />
                </div>
              )
            }}
          </Drawer>
        </>
      ) : (
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>所有标签</CardTitle>
          </CardHeader>
          <CardContent>
            <AllTags allTags={allTags} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
