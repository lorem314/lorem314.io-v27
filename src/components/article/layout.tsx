"use client"

import * as React from "react"
import { ListTree } from "lucide-react"
import type { TableOfContents as TableOfContentsType } from "fumadocs-core/toc"

import { Button } from "@/components/ui/button"
import { ClientPortal } from "@/components/ui/client-portal"
import { useDrawer, Drawer } from "@/components/ui/drawer.legacy"
import { cn } from "@/lib/utils"

import { Actions } from "./actions"
import { TableOfContents } from "./table-of-contents"
import { throttle } from "@/lib/utils"

export function Layout({
  children,
  title,
  toc,
}: Readonly<{
  children: React.ReactNode
  title: string
  toc: TableOfContentsType
}>) {
  const refTocWrapper = React.useRef<HTMLDivElement>(null)

  const isRightDrawerAlwaysCollapsed = false

  const {
    isCollapsed: isRightDrawerCollapsed,
    isOpen: isRightDrawerOpen,
    handler: rightDrawerHandler,
  } = useDrawer({
    isAlwaysCollapsed: isRightDrawerAlwaysCollapsed,
    mediaQuery: "(max-width: 1536px)",
  })

  const showRightDrawerOpener =
    isRightDrawerAlwaysCollapsed || isRightDrawerCollapsed

  React.useEffect(() => {
    const node = refTocWrapper.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    node.style.height = `${window.innerHeight - rect.top - 10}px`

    const applyHeight = throttle(() => {
      if (!refTocWrapper.current) return
      const rect = node.getBoundingClientRect()
      const height = window.innerHeight - rect.top - 16
      node.style.height = `${height}px`
    }, 100)

    window.addEventListener("scroll", applyHeight, { passive: true })
    window.addEventListener("resize", applyHeight, { passive: true })

    return () => {
      window.removeEventListener("scroll", applyHeight)
      window.removeEventListener("resize", applyHeight)
    }
  }, [isRightDrawerCollapsed])

  // const hasToc = toc.length !== 0

  return (
    <div
      className={cn(
        "mx-auto",
        "flex flex-col-reverse items-stretch justify-center gap-x-6 gap-y-12",
        "md:flex-row md:items-stretch",
        showRightDrawerOpener ? "max-w-4xl" : "max-w-full",
      )}
    >
      <Actions
        className={cn(
          "bg-secondary/75 sticky",
          "bottom-4 z-30 -mx-2 rounded-lg border py-6 shadow backdrop-blur-xs",
          "md:static md:mx-0 md:w-10 md:border-none md:bg-transparent md:p-0",
          "md:shadow-none md:backdrop-blur-none",
        )}
      />

      <article
        className={cn(
          "bg-card relative grow rounded-lg px-6 py-12 shadow-xl ring-1 shadow-slate-700/10 ring-gray-900/5 dark:ring-gray-100/5",
          "md:max-w-3xl",
          // "lg:max-w-4xl",
          // "md:px-10 lg:px-16",
          // "lg:pt-16",
          // "lg:pb-28",
        )}
      >
        {children}
      </article>

      {showRightDrawerOpener ? (
        <>
          <ClientPortal target="right-drawer-anchor">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={rightDrawerHandler.open}
            >
              <ListTree />
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
              return <TableOfContents title={title} toc={toc} />
            }}
          </Drawer>
        </>
      ) : (
        <div className="relative flex w-md shrink-0 flex-col gap-4">
          <div
            ref={refTocWrapper}
            className={cn(
              "sticky top-20 overflow-auto rounded-lg",
              "border-muted border shadow-sm",
              "no-scrollbar max-h-fit min-h-9.5",
              // "max-h-[calc(100vh-64px-32px)]",
            )}
          >
            <TableOfContents title={title} toc={toc} />
          </div>
        </div>
      )}
    </div>
  )
}
