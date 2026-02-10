import { cn } from "@/lib/utils"

export function TypographyH2({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
        // "border-b pb-2",
        className,
      )}
      {...restProps}
    >
      <a className="not-prose hover:no-underline" href={`#${restProps.id}`}>
        {children}
      </a>
    </h2>
  )
}

export function TypographyH3({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...restProps}
    >
      <a className="not-prose hover:no-underline" href={`#${restProps.id}`}>
        {children}
      </a>
    </h3>
  )
}

export function TypographyH4({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h4">) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...restProps}
    >
      <a className="not-prose hover:no-underline" href={`#${restProps.id}`}>
        {children}
      </a>
    </h4>
  )
}

export function TypographyH5({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h5">) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        className,
      )}
      {...restProps}
    >
      <a className="not-prose hover:no-underline" href={`#${restProps.id}`}>
        {children}
      </a>
    </h4>
  )
}

export function TypographyH6({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h6">) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-base font-semibold tracking-tight",
        className,
      )}
      {...restProps}
    >
      <a className="not-prose hover:no-underline" href={`#${restProps.id}`}>
        {children}
      </a>
    </h4>
  )
}

export function TypographyInlineCode({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h3">) {
  return (
    <code
      className={cn(
        "not-prose",
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem]",
        "font-mono font-semibold",
      )}
      {...restProps}
    >
      {children}
    </code>
  )
}
