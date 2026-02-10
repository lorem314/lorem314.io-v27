import Link from "next/link"

import { Badge } from "../ui/badge"
import { Separator } from "@/components/ui/separator"

const techs = [
  { title: "React" },
  { title: "Next.js" },
  { title: "TypeScript" },
  { title: "Tailwind CSS" },
  { title: "@trpc" },
  { title: "@tanstack" },
]

export function Footer() {
  return (
    <footer className="bg-secondary border-t py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/*  */}

        <div className="grid grid-cols-1 gap-8">
          <div className="">
            <div>
              <Link className="text-lg font-bold" href="/">
                lorem314.io-v27
              </Link>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                个人博客网站，分享优质教程
              </p>
            </div>
            <div className="mt-6">
              <div className="text-foreground mb-3 text-sm font-semibold">
                技术栈
              </div>
              <ul className="flex flex-wrap items-center gap-2.5">
                {techs.map((tech, index) => {
                  return (
                    <Badge
                      key={index}
                      className="px-2.5 py-1.5"
                      variant="outline"
                      asChild
                    >
                      <li>{tech.title}</li>
                    </Badge>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* <div className="">div</div> */}

          {/* <div className="">
            <div>快速链接</div>
            <ul>
              <li>
                <Link href="/">博客</Link>
              </li>
            </ul>
          </div> */}
        </div>

        <Separator className="mt-6 mb-4" />

        <div className="">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ICP 备案号
          </p>
        </div>
      </div>
    </footer>
  )
}
