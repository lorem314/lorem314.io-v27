"use client"

import * as React from "react"
import { Ellipsis } from "lucide-react"
import type { AnnotationHandler } from "codehike/code"

import { Button } from "@/components/ui/button"

export const InlineFold: AnnotationHandler["Inline"] = ({ children }) => {
  const [folded, setFolded] = React.useState(true)

  if (!folded) {
    return children
  }
  return (
    <Button
      className="text-muted-foreground size-5 rounded"
      onClick={() => setFolded(false)}
      aria-label="Expand"
      variant="outline"
      size="icon-sm"
    >
      <Ellipsis className="size-2.5" />
    </Button>
  )
}
