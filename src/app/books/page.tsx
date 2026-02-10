import Image from "next/image"
import Link from "next/link"

import { booksSource } from "@/lib/source"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
// import { cn } from "@/lib/utils"

export default async function Page() {
  // console.log("booksSource", booksSource.getPageTree())

  const books = booksSource.getPageTree().children.filter((node) => {
    return node.type === "folder"
  })

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle>书籍</CardTitle>
        <CardDescription>深入了解过的书籍</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {books.map((book, index) => {
            const meta = booksSource.getNodeMeta(book)
            // console.log("book", book)
            // console.log("meta", meta)
            const bookName = meta?.path.split("/")[0] || ""
            const title = meta?.data.title || ""
            return (
              <Item key={index} variant="outline" className="group">
                <ItemHeader className="justify-center border-b">
                  <Link href={`/books/${bookName}`}>
                    <Image
                      loading="eager"
                      src={`/images/books/${bookName}/cover.jpg`}
                      alt={`${index}-image`}
                      width={1143}
                      height={1500}
                      className="w-full object-cover"
                    />
                  </Link>
                </ItemHeader>
                <ItemContent>
                  <ItemTitle className="font-bold">
                    <Link
                      className="text-link group-hover:underline"
                      href={`/books/${bookName}`}
                    >
                      {meta?.data.title}
                    </Link>
                  </ItemTitle>
                  <ItemDescription>{meta?.data.subtitle}</ItemDescription>
                </ItemContent>
              </Item>
            )
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

/**
    <Link
                key={index}
                href={`/books/${bookName}`}
                className="group flex justify-center hover:no-underline"
              >
 * 
 */
