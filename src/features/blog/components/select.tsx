"use client"

import React from "react"
import { ChevronDownIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Input, inputVariants } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { useDebounce } from "@/hooks/use-debounce"
import { useContext } from "./context"
import { Tag } from "@/types"

export function Select({ allTags }: { allTags: Tag[] }) {
  const [open, setOpen] = React.useState(false)

  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 250)

  const {
    selectedTags,
    onSelectTag,
    clearSelectedTags,
    isOrLogic,
    toggleIsOrLogic,
  } = useContext()

  const filteredTags = React.useMemo(
    () =>
      allTags.filter((tag) => {
        if (debouncedSearchTerm === "") return true
        const lowercasedDebouncedQuery = debouncedSearchTerm.toLocaleLowerCase()
        const lowercasedTagName = tag.name.toLocaleLowerCase()
        return lowercasedTagName.includes(lowercasedDebouncedQuery)
      }),
    [debouncedSearchTerm, allTags],
  )

  const actions = [
    {
      Icon: () => (isOrLogic ? "||" : "&&"),
      onClick: () => toggleIsOrLogic(),
    },
    {
      Icon: Trash2Icon,
      onClick: () => clearSelectedTags(),
    },
    {
      Icon: ChevronDownIcon,
      onClick: () => setOpen(true),
    },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Card className="col-span-full md:col-span-6">
        <CardHeader>
          <CardTitle>筛选</CardTitle>
        </CardHeader>

        <CardContent>
          <PopoverTrigger asChild>
            <div
              className={cn(
                inputVariants(),
                "relative flex items-stretch gap-0 p-0",
              )}
            >
              {selectedTags.length === 0 ? null : (
                <ul
                  className={cn(
                    "dark:bg-input/30 flex shrink-0 items-center gap-2.5",
                    "no-scrollbar max-w-72 overflow-x-auto",
                    selectedTags.length === 0 ? "pl-0" : "pl-2.5",
                  )}
                >
                  {selectedTags.map((tag) => {
                    return (
                      <li key={tag.name}>
                        <Button
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation()
                            onSelectTag(tag)(event)
                          }}
                        >
                          {tag.name}
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              )}

              <Input
                id="blog-select"
                type="text"
                className={cn(
                  "rounded-none border-none outline-none focus-visible:ring-0",
                )}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onClick={(event) => {
                  event.preventDefault()
                  event.currentTarget.focus()
                }}
                onFocus={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  event.currentTarget.focus()
                  setOpen(true)
                }}
              />

              <div className="dark:bg-input/30 flex items-center pr-2.5">
                {actions.map((action, index) => {
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground font-mono"
                      onClick={(event) => {
                        event.stopPropagation()
                        action.onClick()
                      }}
                    >
                      <action.Icon />
                    </Button>
                  )
                })}
              </div>
            </div>
          </PopoverTrigger>
        </CardContent>

        <PopoverContent
          style={{ width: "var(--radix-popover-trigger-width)" }}
          sideOffset={10}
          className="max-h-36 overflow-auto p-0"
        >
          {filteredTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            const parts = tag.name.split(new RegExp(`(${searchTerm})`, "gi"))

            return (
              <Button
                className="flex w-full justify-between rounded-none"
                variant={isSelected ? "secondary" : "ghost"}
                key={tag.name}
                onClickCapture={(event) => {
                  if (!event.shiftKey) setOpen(false)
                  onSelectTag(tag)(event)
                  setSearchTerm("")
                }}
              >
                <span className="text-muted-foreground">
                  {parts.map((part, index) => {
                    return part.toLowerCase() === searchTerm.toLowerCase() ? (
                      <span key={index} className="text-accent-foreground">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  })}
                </span>
                {/* <span>{tag.name}</span> */}
                <Badge variant="secondary" className="rounded text-xs">
                  {tag.count}
                </Badge>
              </Button>
            )
          })}
        </PopoverContent>
      </Card>
    </Popover>
  )
}
