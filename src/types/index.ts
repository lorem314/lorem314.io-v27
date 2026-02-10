export type Theme = "light" | "dark"
export type PreferredTheme = Theme | "system"

export type BaseColor = "gray" | "neutral" | "slate" | "stone" | "zinc"

export type Tag = {
  name: string
  count: number
}

export type BlogPost = {
  id: string
  title: string
  tags: string[]
  createdAt: string
  url: string
  path: string
  summary: string
}
