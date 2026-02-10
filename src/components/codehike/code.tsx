import { Pre, highlight } from "codehike/code"
import type { AnnotationHandler, BlockAnnotation, RawCode } from "codehike/code"

import { cn } from "@/lib/utils"

import { callout } from "./annotations/callout"
import { lineNumbers } from "./annotations/line-numbers"
import { mark } from "./annotations/mark"
import { diff } from "./annotations/diff"
import { className } from "./annotations/class-name"
import { CopyButton } from "./annotations/copy-button"
import { InlineFold } from "./annotations/fold"
import { hover } from "./annotations/code-mentions"
import {
  collapse,
  collapseTrigger,
  collapseContent,
} from "./annotations/collapse"
import { tokenTransitions } from "./annotations/token-transitions"
import { focus } from "./annotations/focus"

const fold: AnnotationHandler = {
  name: "fold",
  Inline: InlineFold,
}

const baseHandlers: AnnotationHandler[] = [
  // callout,
  // mark,
  // diff,
  // className,
  // fold,
  // hover,
  // collapse,
  // collapseTrigger,
  // collapseContent,
  // tokenTransitions,
  // focus,
]

const handlerMap: { [key: string]: AnnotationHandler[] } = {
  callout: [callout],
  mark: [mark],
  diff: [diff],
  className: [className],
  fold: [fold],
  hover: [hover],
  collapse: [collapse, collapseTrigger, collapseContent],
  tokenTransitions: [tokenTransitions],
  focus: [focus],
}

export async function CodeHikePre({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css")
  const parsedMeta = parseMeta(codeblock.meta)

  const handlers = []

  // console.log("parsedMeta", parsedMeta)

  parsedMeta.handlers.split(" ").forEach((handlerName) => {
    const handler = handlerMap[handlerName] as AnnotationHandler[] | undefined
    if (handler) {
      handlers.push(...handler)
    }
  })

  if (parsedMeta.showLineNumbers) {
    handlers.push(lineNumbers)
  }

  const linesOfCode = highlighted.code.split("\n")

  const diffMinusAnnotationLineNumbers = highlighted.annotations
    .filter((annotation) => annotation.query === "-")
    .map((annotation) => {
      return (annotation as BlockAnnotation).fromLineNumber
    })

  let textToCopy = ""
  if (parsedMeta.showCopyButton) {
    linesOfCode.forEach((line, index) => {
      const lineNumber = index + 1
      if (diffMinusAnnotationLineNumbers.includes(lineNumber)) {
        textToCopy += `${line}\n`
      }
    })
  }

  let css = ""
  const hoverAnnotations = []
  for (const annotation of highlighted.annotations) {
    if (annotation.name === "hover") {
      hoverAnnotations.push(annotation)
    }
  }
  if (hoverAnnotations.length > 0) {
    let rules = ""
    for (const annotation of hoverAnnotations) {
      rules += `div[data-slot="code-mentions"]:has([data-hover="${annotation.query}"]:hover) [data-line]:not([data-line="${annotation.query}"]),`
    }
    css = rules.slice(0, -1) + `{ opacity: 0.5; }`
  }

  const newAnnotations = highlighted.annotations.slice()
  for (let i = 0; i < newAnnotations.length; i++) {
    const annotation = newAnnotations[i]
    if (annotation.name === "callout" && parsedMeta.showLineNumbers) {
      newAnnotations[i] = {
        ...annotation,
        data: { ...annotation.data, showLineNumbers: true },
      }
    }
  }

  return (
    <>
      {hoverAnnotations.length !== 0 ? <style>{css}</style> : null}

      <figure className="group relative my-4! in-[li]:my-0!">
        {parsedMeta.title ? (
          <figcaption
            className={cn(
              "text-accent-foreground",
              "rounded-t-sm p-2.5 font-sans",
              "border border-b-0",
            )}
          >
            {parsedMeta.title}
          </figcaption>
        ) : null}

        {parsedMeta.showCopyButton ? (
          <CopyButton
            className="invisible group-hover:visible"
            text={textToCopy}
          />
        ) : null}

        <Pre
          className={cn(
            "bg-code border pr-0! pl-2!",
            parsedMeta.title ? "rounded-t-none!" : "",
          )}
          code={{ ...highlighted, annotations: newAnnotations }}
          handlers={handlers}
        />
      </figure>
    </>
  )
}

const parseMeta = (rawMeta: string) => {
  const iterator = rawMeta.matchAll(/([a-zA-Z]+)(?:="(.+?)")?/g)
  const meta: { [key: string]: string | boolean } = {}
  for (const match of iterator) {
    const key = match[1]
    const value = match[2]
    if (value === undefined) meta[key] = true
    else meta[key] = value
  }
  return { ...defaultMeta, ...meta }
}

const defaultMeta = {
  showLineNumbers: false,
  title: "",
  showCopyButton: false,
  handlers: "",
}
