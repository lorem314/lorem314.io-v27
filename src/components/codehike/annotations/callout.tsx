import { InlineAnnotation, AnnotationHandler } from "codehike/code"

import { cn } from "@/lib/utils"

export const callout: AnnotationHandler = {
  name: "callout",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 },
    }
  },
  Block: ({ annotation, children }) => {
    const { column } = annotation.data
    const showLineNumbers = annotation.data.showLineNumbers
    return (
      <>
        {children}
        <div
          style={{ minWidth: `${column + 4}ch` }}
          className={cn(
            "mt-1 mr-2 -ml-[calc(1ch-8px)] rounded px-2.5 py-0.5",
            "border-foreground/10 border",
            "relative w-fit whitespace-break-spaces select-none",
            "bg-background text-foreground",
          )}
        >
          <div
            style={{ left: `${column}ch` }}
            className={cn(
              "border-foreground/15 bg-background h-2 w-2 border-t border-l",
              "absolute -top-px -translate-y-1/2 rotate-45",
              showLineNumbers
                ? "translate-x-[calc(8px)]"
                : "translate-x-[calc(-8px)]", // delete
            )}
          />
          {annotation.query}
        </div>
      </>
    )
  },
}
