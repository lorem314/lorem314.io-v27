import Link from "next/link"
import { House, Newspaper, Book, Settings, PanelLeftOpen } from "lucide-react"

import { cn } from "@/lib/utils"

import { SearchDialog } from "./search-dialog"
import { Button } from "@/components/ui/button"

const routes = [
  // { title: "主页", href: "/", Icon: House },
  { title: "博客", href: "/blogs", Icon: Newspaper },
  // { title: "", href: "/books", Icon: Book },
  { title: "设置", href: "/settings", Icon: Settings },
]

export function Header({
  className,
  showLeftDrawerOpener,
  openLeftDrawer,
}: {
  className?: string
  showLeftDrawerOpener: boolean
  openLeftDrawer: () => void
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16 px-4 backdrop-blur-xs",
        // "bg-secondary/75",
        "flex items-center gap-4",
        "border-b [border-image-slice:1]",
        "[border-image-source:linear-gradient(to_right,#0002,#fff,#0002,#fff)]",
        "dark:[border-image-source:linear-gradient(to_right,#fff2,#0000,#fff2,#0000)]",
      )}
    >
      {showLeftDrawerOpener ? (
        <Button variant="outline" size="icon-lg" onClick={openLeftDrawer}>
          <PanelLeftOpen />
        </Button>
      ) : null}

      <Link className="text-lg font-bold hover:no-underline" href="/">
        lorem314.io
      </Link>

      <div className="ml-auto flex items-center gap-4">
        <SearchDialog />

        <ul className="flex gap-4">
          {routes.map((route, index) => {
            return (
              <Button
                className="size-9 shadow-none lg:w-fit lg:border-none"
                key={index}
                variant="outline"
                asChild
              >
                <Link href={route.href}>
                  <route.Icon />
                  <span className="hidden lg:inline">{route.title}</span>
                </Link>
              </Button>
            )
          })}
        </ul>

        <div id="right-drawer-anchor"></div>
      </div>
    </header>
  )
}
