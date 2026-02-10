"use client"

import React from "react"

import { Tag } from "@/types"

type ContextProps = {
  searchTerm: string
  onSearchTermChange: (value: string) => void

  selectedTags: Tag[]
  onSelectTag: (
    tag: Tag,
  ) => (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => void
  clearSelectedTags: () => void

  isOrLogic: boolean
  setIsOrLogic: React.Dispatch<React.SetStateAction<boolean>>
  toggleIsOrLogic: () => void

  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  pageSize: number
}

const Context = React.createContext<ContextProps>({
  searchTerm: "",
  onSearchTermChange: () => {},

  selectedTags: [],
  onSelectTag: () => () => {},
  clearSelectedTags: () => {},

  isOrLogic: false,
  setIsOrLogic: () => {},
  toggleIsOrLogic: () => {},

  currentPage: 1,
  setCurrentPage: () => {},
  pageSize: 5,
})

export function ContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([])
  const [isOrLogic, setIsOrLogic] = React.useState(true)

  const pageSize = 5
  const [currentPage, setCurrentPage] = React.useState(1)

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleSelectTag =
    (tag: Tag) =>
    (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
      setSelectedTags((prevSelectedTags) => {
        const hasSelected = prevSelectedTags.includes(tag)
        // setCurrentPage(1)
        if (hasSelected) {
          event.stopPropagation()
          return prevSelectedTags.filter((selectedTag) => selectedTag !== tag)
        } else {
          if (event.shiftKey) return [...prevSelectedTags, tag]
          else return [tag]
        }
      })
    }

  const clearSelectedTags = () => setSelectedTags([])

  const toggleIsOrLogic = () => {
    setIsOrLogic((prev) => !prev)
  }

  return (
    <Context.Provider
      value={{
        searchTerm,
        onSearchTermChange: handleSearchTermChange,

        selectedTags,
        onSelectTag: handleSelectTag,
        clearSelectedTags,

        isOrLogic,
        setIsOrLogic,
        toggleIsOrLogic,

        currentPage,
        setCurrentPage,
        pageSize,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useContext() {
  const context = React.useContext(Context)
  if (!context) {
    throw new Error("useContext must be used within a <Context.Provider />")
  }
  return context
}
