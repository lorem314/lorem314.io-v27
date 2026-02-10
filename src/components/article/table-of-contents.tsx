"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CopyMinus, CopyPlus } from "lucide-react"
import type {
  TableOfContents as TableOfContentsType,
  TOCItemType,
} from "fumadocs-core/toc"

import { Details } from "@/components/ui/details.legacy"
import { cn } from "@/lib/utils"

export function TableOfContents({
  title,
  toc,
}: {
  title: string
  toc: TableOfContentsType
}) {
  const nestedToc = convertFumadocsTocFromFlatToNested(toc)

  // console.log("toc", toc)
  // console.log("nestedToc", nestedToc)

  const ref = React.useRef<HTMLDivElement | null>(null)

  const refDetails = React.useRef<{
    open: () => void
    close: () => void
  }>(null)

  const refItems = React.useRef<{
    openAll: () => void
    closeAll: () => void
  }>(null)

  const openAll = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    refDetails.current?.open()
    refItems.current?.openAll()
  }

  const closeAll = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    refDetails.current?.close()
    refItems.current?.closeAll()
  }

  React.useEffect(() => {
    if (!ref.current) return
    const node = ref.current
    const links = [...node.querySelectorAll("span[data-url]")]
    // console.log("links", links)
    const headings = links.map((link) => {
      const url = link.getAttribute("data-url") || ""
      const id = url.slice(1)
      // console.log("id", id)
      return document.getElementById(id)
    })
    // console.log("headings", headings)

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // console.log("entry", entry)
          const target = entry.target
          const id = target.id
          // console.log("id", id)
          const link = links.find((link) => {
            return link.getAttribute("data-url") === `#${id}`
          })
          // console.log("link", link)
          if (!link) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
            link.setAttribute("data-state", "visible")
          } else {
            link.setAttribute("data-state", "invisible")
          }
        })
      },
      { threshold: 0.9 },
    )

    headings.forEach((heading) => {
      heading && observer.observe(heading)
    })
  }, [])

  return (
    <div ref={ref} className="bg-card rounded-lg p-2.5 text-sm lg:text-base">
      <Details ref={refDetails}>
        <div className="group flex grow" data-slot="details-head-in-toc">
          <div className="text-muted-foreground grow leading-7 font-bold select-none">
            {title}
          </div>
          <div className="invisible flex group-hover/summary:visible">
            <div
              className={cn(
                "text-muted-foreground flex size-7 items-center justify-center",
                "hover:text-foreground",
              )}
              onClick={openAll}
              role="button"
            >
              <CopyPlus className="p-1" />
            </div>
            <div
              className={cn(
                "text-muted-foreground flex size-7 items-center justify-center",
                "hover:text-foreground",
              )}
              onClick={closeAll}
              role="button"
            >
              <CopyMinus className="p-1" />
            </div>
          </div>
        </div>
        <Items ref={refItems} items={nestedToc} />
      </Details>
    </div>
  )
}

const Items = React.forwardRef((props: { items: TocItem[] }, ref) => {
  const refs = React.useRef(
    props.items.map(() =>
      React.createRef<{ openAll: () => void; closeAll: () => void }>(),
    ),
  )

  React.useImperativeHandle(
    ref,
    () => ({
      openAll: () => refs.current.forEach((ref) => ref.current?.openAll()),
      closeAll: () => refs.current.forEach((ref) => ref.current?.closeAll()),
    }),
    [],
  )

  return (
    <ul data-slot="tree-list">
      {props.items.map((item, index) => {
        return (
          <li key={index}>
            <Item ref={refs.current[index]} item={item} />
          </li>
        )
      })}
    </ul>
  )
})

Items.displayName = "TocItems"

type TocItem = TOCItemType & { items: TocItem[] }

const Item = React.forwardRef(
  (props: { item: TOCItemType & { items: TocItem[] } }, ref) => {
    const router = useRouter()

    const refDetails = React.useRef<{
      open: () => void
      close: () => void
    }>(null)

    const refItems = React.useRef<{
      openAll: () => void
      closeAll: () => void
    }>(null)

    const openAll = (event: React.MouseEvent<HTMLElement>) => {
      event?.stopPropagation()
      event?.preventDefault()
      refDetails.current?.open()
      refItems.current?.openAll()
    }

    const closeAll = (event: React.MouseEvent<HTMLElement>) => {
      event?.stopPropagation()
      event?.preventDefault()
      refDetails.current?.close()
      refItems.current?.closeAll()
    }

    React.useImperativeHandle(ref, () => ({ closeAll, openAll }), [])

    const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.stopPropagation()
      event.preventDefault()
      const url = event.currentTarget.dataset.url
      if (!url) return
      const id = url.slice(1)
      const elem = document.getElementById(id)
      if (!elem) return
      router.push(url, { scroll: false })
      elem.scrollIntoView()
    }

    if (props.item.items.length === 0) {
      return (
        <span
          className={cn(
            "ml-2.5 underline-offset-4 select-none hover:underline",
            "data-[state=visible]:text-foreground",
            "data-[state=invisible]:text-muted-foreground",
          )}
          data-url={props.item.url}
          onClick={handleClick}
        >
          {props.item.title}
          {/* {resolveTitle(props.item.title)} */}
        </span>
      )
    }

    return (
      <Details ref={refDetails}>
        <div className="group flex grow" data-slot="details-head-in-toc">
          <div className="grow pl-0.5 select-none">
            <span
              className={cn(
                "underline-offset-4 select-none hover:underline",
                "data-[state=visible]:text-foreground",
                "data-[state=invisible]:text-muted-foreground",
              )}
              data-url={props.item.url}
              onClick={handleClick}
            >
              {props.item.title}
            </span>
          </div>
          <div className="invisible flex group-hover/summary:visible">
            <div
              className={cn(
                "text-muted-foreground flex size-7 items-center justify-center",
                "hover:text-foreground",
              )}
              onClick={openAll}
            >
              <CopyPlus className="p-1" />
            </div>
            <div
              className={cn(
                "text-muted-foreground flex size-7 items-center justify-center",
                "hover:text-foreground",
              )}
              onClick={closeAll}
            >
              <CopyMinus className="p-1" />
            </div>
          </div>
        </div>

        <Items ref={refItems} items={props.item.items} />
      </Details>
    )
  },
)

Item.displayName = "TocItem"

export function convertFumadocsTocFromFlatToNested(flatArray: TOCItemType[]) {
  const result = [] // 存储最终嵌套结构的根节点数组
  const stack: TocItem[] = [] // 辅助栈，用于跟踪当前处理路径上的节点

  for (const item of flatArray) {
    // 创建新节点（浅拷贝原对象并添加 items 数组）
    const node = { ...item, items: [] }

    // 弹出栈中所有深度大于等于当前节点的元素（找到父节点）
    while (stack.length && node.depth <= stack[stack.length - 1].depth) {
      stack.pop()
    }

    // 确定当前节点的父节点
    if (stack.length) {
      // 如果栈非空，当前节点是栈顶节点的子节点
      stack[stack.length - 1].items.push(node)
    } else {
      // 如果栈为空，当前节点是根节点
      result.push(node)
    }

    // 将当前节点压入栈（可能成为后续节点的父节点）
    stack.push(node)
  }

  return result
}

// function resolveTitle(title: string | React.ReactNode | undefined) {
//   if (!title) return null

//   if (typeof title === "string") return title

//   if (Array.isArray(title)) {
//     return title.reduce((acc, elem) => {
//       if (typeof elem === "string") return acc + elem
//       return acc + elem.props.children
//     }, "")
//   }
// }
