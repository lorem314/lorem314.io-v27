"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useContext } from "./context"
import type { Tag } from "@/types"

export function AllTags({ allTags }: { allTags: Tag[] }) {
  const { selectedTags, onSelectTag } = useContext()

  return (
    <ul className="flex flex-wrap gap-2.5">
      {allTags.map((tag, index) => {
        const isSelected = selectedTags.includes(tag)
        return (
          <li key={index}>
            <Button
              className="border"
              variant={isSelected ? "default" : "outline"}
              onClick={onSelectTag(tag)}
            >
              {tag.name}
              <Separator orientation="vertical" />
              {tag.count}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
