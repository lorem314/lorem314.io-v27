"use client"

import * as React from "react"
import { CopyIcon, CopyCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function CopyButton({
  className = "",
  text,
}: {
  className?: string
  text: string
}) {
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setOpen(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "absolute top-1.5 right-1.5 size-7",
            "lg:size-8",
            className,
          )}
          data-slot="copy-button"
          variant="outline"
          size="icon"
          onClick={handleClick}
        >
          {copied ? (
            <CopyCheckIcon color="green" className="size-3 lg:size-4" />
          ) : (
            <CopyIcon className="size-3 lg:size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {copied ? <p>已复制</p> : <p>复制代码</p>}
      </TooltipContent>
    </Tooltip>
  )
}
