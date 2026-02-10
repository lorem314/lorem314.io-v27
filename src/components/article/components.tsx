import React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import { ExternalLinkIcon } from "lucide-react"
// import type { RawCode } from "codehike/code"

import {
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyH6,
  TypographyInlineCode,
} from "@/components/ui/typography"
import { cn } from "@/lib/utils"

import { CodeHikePre } from "../codehike/code"
import { CodeWithTabs } from "../codehike/code-with-tabs"
import { HoverContainer } from "../codehike/annotations/code-mentions"

type ImagePorps = React.ComponentProps<typeof NextImage> & { caption?: string }
const Image = ({ caption, ...restProps }: ImagePorps) => {
  return (
    <figure>
      <NextImage {...restProps} />
      {caption ? (
        <figcaption className="text-center">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

type LinkProps = React.ComponentProps<"a">
const Link = ({ children, href, className, ...restProps }: LinkProps) => {
  if (href?.startsWith("https")) {
    return (
      <a
        className={cn(
          "text-link inline-flex flex-wrap items-center gap-1.5 no-underline",
          "hover:underline",
          className,
        )}
        href={href}
        {...restProps}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <ExternalLinkIcon className="size-4" />
      </a>
    )
  }

  if (href?.startsWith("hover:")) {
    const hover = href.slice("hover:".length)
    return (
      <span
        className={cn(
          "underline decoration-dotted underline-offset-4",
          className,
        )}
        data-hover={hover}
      >
        {children}
      </span>
    )
  }

  return (
    <NextLink className={cn("", className)} href={href || ""} {...restProps}>
      {children}
    </NextLink>
  )
}

export const components = {
  Image,
  h2: TypographyH2,
  h3: TypographyH3,
  h4: TypographyH4,
  h5: TypographyH5,
  h6: TypographyH6,

  // code
  CodeHikePre,
  // CodeHikePre: ({ codeblock }: { codeblock: RawCode }) => {
  //   return (
  //     <React.Suspense fallback={<div>suspensing...</div>}>
  //       <CodeHikePre codeblock={codeblock} />
  //     </React.Suspense>
  //   )
  // },

  // inline code
  code: TypographyInlineCode,

  // tabs
  CodeWithTabs,

  // code mentions
  HoverContainer,
  a: Link,
}
