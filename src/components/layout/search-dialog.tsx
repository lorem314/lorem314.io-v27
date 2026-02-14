"use client"

import React from "react"
import Link from "next/link"
import { keepPreviousData } from "@tanstack/react-query"
import { AlertCircleIcon, SearchIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "../ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  ItemGroup,
  ItemHeader,
  ItemFooter,
  ItemSeparator,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import { useDebounce } from "@/hooks/use-debounce"
import { useForm } from "@tanstack/react-form"
import { trpc } from "@/trpc/client"

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="size-9 lg:w-48 lg:rounded-full"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          <SearchIcon />
          <span className="mr-auto hidden lg:inline">搜索</span>
          <KbdGroup className="hidden lg:block">
            <Kbd>Ctrl</Kbd>
            <span> + </span>
            <Kbd>B</Kbd>
          </KbdGroup>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="flex h-[calc(100vh-8rem)] flex-col border-0 p-0 sm:max-w-lg"
        aria-describedby=""
        showCloseButton={false}
      >
        <DialogHeader className="hidden">
          <DialogTitle className="text-center">全站搜索</DialogTitle>
        </DialogHeader>

        <div className="grow overflow-y-auto">
          <Search setOpen={setOpen} />
        </div>

        <DialogFooter
          className={cn(
            "text-muted-foreground bg-secondary rounded-b-xl pt-4 pb-4 text-sm sm:justify-center",
          )}
        >
          <div className="text-center">
            搜索功能由 <code>@elasticsearch</code> 实现
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const Search = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 500)

  const globalSearchQuery = trpc.search.useQuery(
    { search: debouncedSearch },
    {
      enabled: !!debouncedSearch.trim(),
      placeholderData: keepPreviousData,
      staleTime: 30 * 1000,
    },
  )

  const trimmedDebouncedSearch = debouncedSearch.trim()

  return (
    <Card
      className={cn(
        "h-full grow gap-0 rounded-lg border-none bg-transparent p-0 shadow-none",
      )}
    >
      <CardHeader className="flex px-0">
        <Input
          className={cn(
            "rounded-b-none text-sm shadow-none",
            "focus-visible:border-input",
            "focus-visible:ring-transparent",
            "focus-visible:ring-0",
          )}
          placeholder="全站搜索..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </CardHeader>
      <CardContent className="grow px-1 py-4">
        {globalSearchQuery.isFetching ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="text-muted-foreground size-8" />
          </div>
        ) : globalSearchQuery.isError ? (
          <Alert variant="destructive" className="">
            <AlertCircleIcon />
            <AlertTitle>搜索出错</AlertTitle>
            <AlertDescription>
              <p>请复制粘贴以下内容私信我，我会第一时间修复</p>
              <pre>{JSON.stringify(globalSearchQuery.error, undefined, 2)}</pre>
            </AlertDescription>
          </Alert>
        ) : trimmedDebouncedSearch.length === 0 ? null : (
          <ItemGroup>
            {globalSearchQuery.data?.result.hits.hits.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyDescription>没有找到符合条件的结果...</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              globalSearchQuery.data?.result.hits.hits.map((hit) => {
                // const dateString = hit._source?.createdAt
                //   ? new Date(hit._source?.createdAt).toLocaleDateString()
                //   : ""

                const replacedTitle =
                  debouncedSearch.trim().length !== 0
                    ? hit._source?.title.replaceAll(
                        new RegExp(debouncedSearch, "gi"),
                        (target) => `<mark>${target}</mark>`,
                      ) || ""
                    : hit._source?.title || ""

                const replacedSummary =
                  debouncedSearch.trim().length !== 0
                    ? hit._source?.summary.replaceAll(
                        new RegExp(debouncedSearch, "gi"),
                        (target) => `<mark>${target}</mark>`,
                      ) || ""
                    : hit._source?.summary || ""

                // return <pre>{JSON.stringify(hit, null, 2)}</pre>
                return (
                  <Item key={hit._id} asChild>
                    <Link
                      href={hit._source?.title.replaceAll(" ", "") || ""}
                      className="hover:no-underline"
                      onClick={() => {
                        setOpen(false)
                      }}
                    >
                      <ItemHeader>
                        <ItemTitle
                          className="gap-0 font-bold"
                          dangerouslySetInnerHTML={{
                            __html: replacedTitle,
                          }}
                        />
                      </ItemHeader>

                      <ItemContent>
                        <p>
                          {/* <Badge
                            variant="outline"
                            className="mr-1 rounded-sm"
                            asChild
                          >
                            <time dateTime={dateString}>{dateString}</time>
                          </Badge> */}

                          <span
                            dangerouslySetInnerHTML={{
                              __html: replacedSummary,
                            }}
                          />
                        </p>
                      </ItemContent>

                      <ol className="text-muted-foreground list-decimal pl-6">
                        {hit.highlight?.["content.ngram"] &&
                          hit.highlight?.["content.ngram"].map(
                            (content, index) => {
                              return (
                                <li
                                  key={index}
                                  dangerouslySetInnerHTML={{ __html: content }}
                                />
                              )
                            },
                          )}
                      </ol>

                      <ItemFooter>
                        {/* {hit._source?.createdAt
                          ? new Date(
                              hit._source?.createdAt,
                            ).toLocaleDateString()
                          : null} */}
                      </ItemFooter>
                    </Link>
                  </Item>
                )
              })
            )}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
