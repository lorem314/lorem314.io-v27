// "use client"

// import React from "react"

import { InlineAnnotation, AnnotationHandler, InnerLine } from "codehike/code"

export function HoverContainer(props: { children: React.ReactNode }) {
  // const containerRef = React.useRef<HTMLDivElement>(null)
  // const [dynamicCSS, setDynamicCSS] = React.useState<string>("")

  // React.useEffect(() => {
  //   if (containerRef.current) {
  //     // Collect all unique data-hover values from the DOM (from inline <a> tags)
  //     const hoverElements =
  //       containerRef.current.querySelectorAll("[data-hover]")

  //     // console.log("hoverElements", hoverElements)

  //     const uniqueHovers = new Set<string>()
  //     hoverElements.forEach((el) => {
  //       const hoverValue = el.getAttribute("data-hover")
  //       if (hoverValue) uniqueHovers.add(hoverValue)
  //     })

  //     // Also collect unique data-line values (from code lines), assuming they match hovers
  //     const lineElements = containerRef.current.querySelectorAll("[data-line]")

  //     console.log("lineElements", lineElements)

  //     // lineElements.forEach((el) => {
  //     //   const lineValue = el.getAttribute("data-line")
  //     //   if (lineValue) uniqueHovers.add(lineValue)
  //     // })

  //     // Generate the CSS rules dynamically
  //     // if (uniqueHovers.size > 0) {
  //     //   const rules = Array.from(uniqueHovers)
  //     //     .map(
  //     //       (hover) => `
  //     //       .hover-container:has([data-hover="${hover}"]:hover) [data-line]:not([data-line="${hover}"])`,
  //     //     )
  //     //     .join(",\n")
  //     //   const css = `${rules} { opacity: 0.5; }`
  //     //   setDynamicCSS(css)
  //     // }
  //   }
  // }, []) // Run once after mount; re-run if children change (add props.children to deps if dynamic)

  return (
    <div
      // ref={containerRef}
      data-slot="code-mentions"
    >
      {/* {dynamicCSS && <style>{dynamicCSS}</style>} */}
      {props.children}
    </div>
  )
}

export const hover: AnnotationHandler = {
  name: "hover",
  onlyIfAnnotated: true,
  Line: ({ annotation, ...props }) => {
    return (
      <InnerLine
        merge={props}
        className="transition-opacity"
        data-line={annotation?.query || ""}
      />
    )
  },
}

/*

.hover-container:has([data-hover="one"]:hover) [data-line]:not([data-line="one"]),
.hover-container:has([data-hover="two"]:hover)
  [data-line]:not([data-line="two"]) {
  opacity: 0.5;
}

*/
