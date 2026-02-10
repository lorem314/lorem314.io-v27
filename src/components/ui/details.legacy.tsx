"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "./button"
import { cn } from "@/lib/utils"

const Details = React.forwardRef(
  (props: React.ComponentProps<"details">, ref) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(props.open || true)

    const childArray = React.Children.toArray(props.children)

    const open = () => {
      setIsOpen(true)
    }
    const close = () => {
      setIsOpen(false)
    }

    React.useImperativeHandle(ref, () => ({ open, close }), [open, close])

    const handleClick = (event: React.MouseEvent) => {
      event.preventDefault()
      isOpen ? close() : open()
    }

    const Icon = isOpen ? ChevronDown : ChevronRight

    return (
      <details className="group/details" open={isOpen}>
        <summary
          className={cn("group/summary flex rounded", "hover:bg-accent")}
          onClick={handleClick}
        >
          <Icon className="text-muted-foreground hover:text-foreground size-7 shrink-0 p-1.5" />
          {childArray[0]}
        </summary>
        {childArray[1]}
      </details>
    )
  },
)

export { Details }
