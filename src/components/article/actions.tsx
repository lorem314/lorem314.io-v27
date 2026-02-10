"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Minimize,
  Fullscreen,
  ListTree,
  ArrowLeft,
  ArrowUpToLine,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Actions({ className }: { className: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const [isFullscreen, setIsFullscreen] = React.useState(false)

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) setIsFullscreen(true)
      else setIsFullscreen(false)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const enterFullscreen = () => {
    if (!document.documentElement.requestFullscreen) {
      alert("浏览器不支持全屏")
      return
    }
    document.documentElement.requestFullscreen()
  }

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }

  const toTop = () => {
    document.documentElement.scrollTo(0, 0)
  }

  const goBack = () => {
    const splitted = pathname.split("/")
    const withoutLast = splitted.slice(0, splitted.length - 1)
    router.push(withoutLast.join("/"))
  }

  const actions = [
    { tip: "后退", Icon: ArrowLeft, onClick: goBack },
    { tip: "回到顶部", Icon: ArrowUpToLine, onClick: toTop },
    isFullscreen
      ? { tip: "退出全屏", Icon: Minimize, onClick: exitFullscreen }
      : { tip: "进入全屏", Icon: Fullscreen, onClick: enterFullscreen },
  ]

  return (
    <div className={cn("", className)}>
      <ul
        className={cn(
          "flex flex-row items-center justify-around gap-4",
          "md:sticky md:top-20 md:flex-col",
        )}
      >
        {actions.map((action, index) => {
          return (
            <li key={index}>
              <Button
                className="size-16 md:size-10"
                variant="outline"
                size="icon-lg"
                onClick={action.onClick}
              >
                <action.Icon className="size-8 md:size-4" />
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
