import Link from "next/link"
import { House, Newspaper, Book, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const routes = [
  { title: "主页", href: "/", Icon: House },
  { title: "博客", href: "/blogs", Icon: Newspaper },
  // { title: "", href: "/books", Icon: Book },
  { title: "设置", href: "/settings", Icon: Settings },
]

export function SideNav({ closeDrawer }: { closeDrawer?: () => void }) {
  return (
    <nav className="flex h-full overflow-y-auto">
      <ul className="bg-secondary flex w-16 shrink-0 grow-0 flex-col items-center gap-2.5 border-r pt-2.5">
        {routes.map((route, index) => {
          return (
            <li key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-lg"
                    asChild
                    onClick={() => {
                      if (closeDrawer) closeDrawer()
                    }}
                  >
                    <Link href={route.href}>
                      <route.Icon />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{route.title}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          )
        })}
      </ul>
      <section className="bg-background no-scrollbar mx-2.5 mt-2.5 overflow-y-auto rounded-t-lg border px-4 py-2.5 shadow">
        <ul>
          {Array(20)
            .fill(null)
            .map((_, index) => {
              return (
                <li key={index}>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Neque, consequatur, sint exercitationem quae dicta mollitia
                  tenetur cum porro officia quod quis beatae eligendi dolorum.
                  Laboriosam unde quam esse quaerat architecto praesentium odit.
                </li>
              )
            })}
        </ul>
      </section>
    </nav>
  )
}
