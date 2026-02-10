import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

import { booksSource } from "@/lib/source"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function Page(props: {
  params: Promise<{ title: string }>
}) {
  const params = await props.params
  // const book = booksSource.getPage([params.title])
  // console.log("params", params)

  const pageTree = booksSource.getPageTree()
  const book = pageTree.children.find((node) => {
    // console.log("node", node.name)
    const name = node.name as string
    return (
      node.type === "folder" &&
      name.replaceAll(" ", "") === decodeURI(params.title)
    )
  })

  // const books = booksSource.getPageTree().children.filter((node) => {
  //   return node.type === "folder"
  // })
  // const book = books.filter((book) => {
  //   return book.name === params.title
  // })

  // const bookByHref = booksSource.getPageByHref(`/books/${params.title}`)
  // console.log("bookByHref", bookByHref)

  // console.log("params", params)
  // const book = booksSource.getPage(["分布式NodeJS"])

  // console.log("book", book)
  // console.log("booksSource", booksSource.getPageTree())

  if (!book || book.type !== "folder") {
    return notFound()
  }

  const meta = booksSource.getNodeMeta(book)
  // console.log("meta", meta)

  const bookName = meta?.path.split("/")[0] || ""

  const chapters = book.children.filter((node) => {
    return node.type === "page"
  })

  // console.log("chapters", chapters)

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>{meta?.data.title}</CardTitle>
        <CardDescription>{meta?.data.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          loading="eager"
          src={`/images/books/${bookName}/cover.jpg`}
          alt={`${bookName}封面`}
          width={1143}
          height={1500}
          className="w-full object-cover"
        />
      </CardContent>
      <CardFooter>
        <Accordion type="single" collapsible className="w-full">
          {chapters.map((node, index) => {
            const chapter = booksSource.getNodePage(node)
            if (!chapter) null
            return (
              <AccordionItem
                key={index}
                value={chapter?.data.title || `${index}`}
                className=""
              >
                <AccordionTrigger className="group group flex-row-reverse justify-end px-2.5 hover:no-underline">
                  <Link href={`/books/${bookName}/第1章`} className="text-link">
                    阅读
                  </Link>
                  <span className="inline-flex grow justify-between underline-offset-4 group-hover:underline">
                    第 {chapter?.data.chapter} 章 {chapter?.data.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <pre>{JSON.stringify(chapter?.data.toc, undefined, 2)}</pre>
                  <p>
                    We offer worldwide shipping through trusted courier
                    partners. Standard delivery takes 3-5 business days, while
                    express shipping ensures delivery within 1-2 business days.
                  </p>
                  <p>
                    All orders are carefully packaged and fully insured. Track
                    your shipment in real-time through our dedicated tracking
                    portal.
                  </p>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardFooter>
    </Card>
  )
}
