"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { X } from "lucide-react"

import { Button } from "./button"
import { cn } from "@/lib/utils"

type Side = "top" | "right" | "bottom" | "left"

type DrawerProps = {
  isOpen: boolean
  title?: string
  side: Side
  size: string
  onClose: () => void
  children:
    | Element
    | React.ReactElement
    | (({ closeDrawer }: { closeDrawer?: () => void }) => React.ReactElement)
}

export function Drawer(props: DrawerProps) {
  const { isOpen, ...restPorps } = props

  React.useEffect(() => {
    const hasScrollbar = window.innerWidth > document.body.clientWidth

    if (isOpen && hasScrollbar) {
      document.body.style.overflow = "hidden"
      document.body.style.marginRight = "15px"

      const scrollDiv = document.createElement("div")

      scrollDiv.style.width = "100px"
      scrollDiv.style.height = "100px"
      scrollDiv.style.overflow = "scroll"
      scrollDiv.style.visibility = "hidden"
      scrollDiv.style.position = "absolute"
      scrollDiv.style.top = "-9999px"

      document.body.appendChild(scrollDiv)
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      document.body.removeChild(scrollDiv)

      document.body.style.marginRight = scrollbarWidth + "px"

      return () => {
        document.body.style.overflow = "auto"
        document.body.style.marginRight = "auto"
      }
    }
  }, [isOpen])

  // return (
  //   <React.Activity mode={isOpen ? "visible" : "hidden"}>
  //     <Portal {...restPorps} />
  //   </React.Activity>
  // )

  return isOpen ? <Portal {...restPorps} /> : null
}

function Portal(props: Omit<DrawerProps, "isOpen">) {
  const { title, side, size, onClose, children } = props

  const [style, setStyle] = React.useState({
    opacity: 0,
    transform: getInitialTransform(side),
  })

  React.useEffect(() => {
    const transform = "translate(0, 0)"
    setStyle({ opacity: 1, transform })
  }, [])

  const closeDrawer = () => {
    Promise.resolve()
      .then(() => {
        return new Promise<void>((resolve) => {
          const transform = getInitialTransform(side)
          setStyle({ opacity: 0, transform })
          setTimeout(() => resolve(), 150)
        })
      })
      .then(() => onClose && onClose())
  }

  const { transform, opacity } = style
  const positionProps = getPositionProps(side, size)

  return createPortal(
    <>
      <div
        role="button"
        className={cn(
          "fixed inset-0 z-50 bg-black/10 backdrop-blur-xs",
          "transition-opacity",
        )}
        style={{ opacity }}
        onClick={closeDrawer}
      />
      <div
        role="dialog"
        data-side={side}
        className={cn(
          "bg-sidebar fixed z-50 flex flex-col overflow-y-auto shadow-xl",
          "transition-transform",
          "data-[side=top]:border-b",
          "data-[side=right]:border-l",
          "data-[side=bottom]:border-t",
          "data-[side=left]:border-r",
        )}
        style={{ ...positionProps, transform }}
      >
        <header
          className={cn(
            "flex h-16 shrink-0 grow-0 items-center gap-4 border-b px-4",
            "bg-secondary",
            side === "left" ? "" : "flex-row-reverse justify-between",
          )}
        >
          <Button variant="outline" size="icon-lg" onClick={closeDrawer}>
            <X />
          </Button>
          {title ? (
            <div className="text-xl font-bold">{title}</div>
          ) : (
            <Link className="text-lg font-bold" href="/">
              lorem314.io
            </Link>
          )}
        </header>
        <section className="overflow-y-auto">
          {typeof children === "function"
            ? children({ closeDrawer })
            : React.cloneElement(
                children as React.ReactElement<{ closeDrawer: () => void }>,
                { closeDrawer },
              )}
        </section>
        {/* <footer className="">footer</footer> */}
      </div>
    </>,
    document.body,
  )
}

const getPositionProps = (side: Side, size: string) => {
  switch (side) {
    case "top":
    case "bottom":
      return { left: 0, right: 0, [side]: 0, height: size }
    case "left":
    case "right":
      return { top: 0, bottom: 0, [side]: 0, width: size }
    default:
      return { top: 0, bottom: 0, left: 0, width: size }
  }
}

const getInitialTransform = (side: Side) => {
  switch (side) {
    case "top":
      return "translate(0, -100%)"
    case "right":
      return "translate(100%, 0)"
    case "bottom":
      return "translate(0, 100%)"
    case "left":
      return "translate(-100%, 0)"
    default:
      return "translate(-100%, 0)"
  }
}

export const useDrawer = ({
  isAlwaysCollapsed,
  mediaQuery,
}: {
  isAlwaysCollapsed: boolean
  mediaQuery: string
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const [isCollapsed, setIsCollapsed] = React.useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(mediaQuery).matches
      : true,
  )

  React.useEffect(() => {
    const isCollapsed =
      isAlwaysCollapsed || window.matchMedia(mediaQuery).matches
    setIsCollapsed(isCollapsed)
  }, [isAlwaysCollapsed, mediaQuery])

  React.useEffect(() => {
    const handleWindowResize = () => {
      setIsCollapsed((prevIsCollapsed) => {
        const nextIsCollapsed =
          isAlwaysCollapsed || window.matchMedia(mediaQuery).matches
        if (prevIsCollapsed && !nextIsCollapsed && !isAlwaysCollapsed) {
          setIsOpen(false)
        }
        return nextIsCollapsed
      })
    }

    window.addEventListener("resize", handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [isAlwaysCollapsed, mediaQuery])

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    isCollapsed,
    isOpen,
    handler: { open, close },
  }
}
