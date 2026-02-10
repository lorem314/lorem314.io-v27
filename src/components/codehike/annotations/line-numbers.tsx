import { type AnnotationHandler, InnerLine } from "codehike/code"

export const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 1
    return (
      <div className="flex">
        <span
          className="text-foreground/50 text-right select-none"
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className="flex-1 pl-2" />
      </div>
    )
  },
}
