"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "./button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function Paginator({
  className,
  currentPage,
  setCurrentPage,
  siblingCount = 2,
  totalPage,
}: {
  className?: string
  currentPage: number
  setCurrentPage: (age0: number) => void
  siblingCount?: number
  totalPage: number
}) {
  const pages: (number | "ellipsis")[] = []
  pages.push(1)
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 2)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPage - 1)
  const shouldShowLeftEllipsis = leftSiblingIndex > 2
  const shouldShowRightEllipsis = rightSiblingIndex < totalPage - 1

  if (shouldShowLeftEllipsis) {
    pages.push("ellipsis")
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    pages.push(i)
  }

  if (shouldShowRightEllipsis) {
    pages.push("ellipsis")
  }

  if (totalPage > 1) {
    pages.push(totalPage)
  }

  return (
    <Pagination className={className}>
      <PaginationContent className="space-x-2.5">
        <PaginationItem>
          <Button
            variant="outline"
            size="icon-lg"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(
                currentPage - 1 >= 1 ? currentPage - 1 : currentPage,
              )
            }}
          >
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }
          const isActive = page === currentPage
          return (
            <PaginationItem key={index}>
              <Button
                data-active={isActive ? "true" : "false"}
                key={page}
                variant={isActive ? "default" : "outline"}
                size="icon-lg"
                onClick={() => {
                  setCurrentPage(page)
                }}
              >
                {page}
              </Button>
            </PaginationItem>
          )
        })}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon-lg"
            disabled={currentPage === totalPage}
            onClick={() => {
              setCurrentPage(
                currentPage + 1 <= totalPage ? currentPage + 1 : currentPage,
              )
            }}
          >
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
