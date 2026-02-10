// components/ClientPortal.tsx
"use client"

import { ReactNode, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

interface ClientPortalProps {
  children: ReactNode
  target?: string // 可选，指定 portal 目标，默认 document.body
}

export function ClientPortal({ children, target }: ClientPortalProps) {
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    ref.current = target
      ? document.getElementById(target) || document.body
      : document.body
    setMounted(true)
  }, [])

  // 服务端和未挂载时：直接原地渲染 children（保持结构一致）
  if (!mounted || !ref.current || typeof document === "undefined") {
    return <div style={{ display: "none" }}>{children}</div>
  }

  // 客户端挂载后：才使用 portal 移到目标位置
  return createPortal(children, ref.current)
}
