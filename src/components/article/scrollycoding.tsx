import fs from "fs/promises"
import path from "path"

import React from "react"
import { bundleMDX } from "mdx-bundler"
import { getMDXComponent } from "mdx-bundler/client"
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx"
import { z } from "zod"
import {
  Selection,
  Selectable,
  SelectionProvider,
} from "codehike/utils/selection"
import { Pre, RawCode, highlight } from "codehike/code"
import { Block, CodeBlock, parseRoot } from "codehike/blocks"
import { cn } from "@/lib/utils"

import { tokenTransitions } from "@/components/codehike/annotations/token-transitions"
import { focus } from "@/components/codehike/annotations/focus"

import { InferPageType } from "fumadocs-core/source"
import { blogsSource } from "@/lib/source"
import { TypographyH2, TypographyH3 } from "../ui/typography"

const Schema = Block.extend({
  // header: Block,
  // steps: z.array(Block.extend({ code: CodeBlock })),
  // footer: Block,
  header: Block,
  h2s: z.array(
    Block.extend({
      steps: z.array(
        Block.extend({
          code: CodeBlock,
        }),
      ),
    }),
  ),
  footer: Block,
})

const chConfig = {
  components: { code: "Code" },
}

export async function Scrollycoding({
  blogPost,
}: {
  blogPost: InferPageType<typeof blogsSource>
}) {
  if (!blogPost?.absolutePath) {
    return <div>no absolute path</div>
  }

  // 调整为你的 MDX 文件目录
  const filePath = path.join(process.cwd(), blogPost.absolutePath)
  // console.log("filePath", filePath)
  // const filePath = path.join(postsDir, `${title}.mdx`)
  const mdxString = await fs.readFile(filePath, "utf8")
  // console.log("mdxString", mdxString)
  // const { steps } = parseRoot(mdxString, Schema)

  const { code: mdxCode, frontmatter } = await bundleMDX({
    source: mdxString,
    mdxOptions: (options) => {
      options.remarkPlugins = [[remarkCodeHike, chConfig]]
      options.recmaPlugins = [[recmaCodeHike, chConfig]]
      options.jsx = true
      return options
    },
  })

  const MDXComponent = getMDXComponent(mdxCode)

  const { header, h2s, footer } = parseRoot(MDXComponent, Schema, {
    components,
  }) as {
    header: { title: string; children: React.ReactNode }
    h2s: {
      title: string
      children: React.ReactNode
      steps: { title: string; children: React.ReactNode; code: RawCode }[]
    }[]
    // steps: { title: string; children: React.ReactNode; code: RawCode }[]
    footer: { title: string; children: React.ReactNode }
  }

  // console.log("h2s", h2s)

  return (
    <>
      <header className="my-8 flex justify-center">
        <div className="prose dark:prose-invert shrink-0 grow px-6">
          <h1>{frontmatter.title}</h1>
          {header.title && <h2>{header.title}</h2>}
          {header.children}
        </div>
        <div className="max-w-3xl grow text-center">
          <div>tags</div>
          <div>发布于 {frontmatter.createdAt}</div>
        </div>
      </header>

      {h2s.map((h2, h2Index) => {
        return (
          <section key={h2Index} className="my-2">
            <SelectionProvider
              className={cn(
                "flex flex-col items-center justify-center gap-8",
                "xl:flex-row xl:items-stretch",
              )}
            >
              {/*  */}

              <div className="prose dark:prose-invert">
                {h2.steps.map((step, h2StepIndex) => {
                  return (
                    <Selectable
                      key={h2StepIndex}
                      index={h2StepIndex}
                      selectOn={["click", "scroll"]}
                      className={cn(
                        "mb-24 border-l-4 px-6 py-2",
                        "data-[selected=true]:border-link",
                      )}
                    >
                      {step.title ? <h3>{step.title}</h3> : null}
                      <div>{step.children}</div>
                    </Selectable>
                  )
                })}
              </div>

              <div className={cn("w-full grow bg-red-100", "xl:max-w-3xl")}>
                <div className={cn("xl:sticky xl:top-16")}>
                  <Selection
                    from={h2.steps.map((step) => (
                      <Code codeblock={step.code} key={"key"} />
                    ))}
                  />
                </div>
              </div>

              {/*  */}
            </SelectionProvider>
          </section>
        )
      })}

      <footer className="my-8 flex justify-center">
        <div className="prose dark:prose-invert shrink-0 grow px-6">
          {footer.title && <h2>{footer.title}</h2>}
          {footer.children}
        </div>
        <div className="max-w-3xl grow"></div>
      </footer>
    </>
  )
}

const Left = () => {}
const Right = () => {}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css")
  return (
    <Pre
      code={highlighted}
      handlers={[tokenTransitions, focus]}
      className="no-scrollbar flex h-full origin-center items-center overflow-auto bg-green-200 px-2.5 text-sm lg:h-fit"
    />
  )
}

const components = {
  code: (props: React.ComponentProps<"code">) => {
    return (
      <code className="text-green-600 dark:text-green-500">
        {props.children}
      </code>
    )
  },
  Code,
}

/*

{h2s.map((h2, h2Index) => {
  return (
    <section key={h2Index}>
      <header className="my-16 flex justify-center">
        <div className="prose dark:prose-invert shrink-0 grow px-6">
          <h2>{h2.title}</h2>
          {h2.children}
        </div>
        <div className="max-w-3xl grow"></div>
      </header>

      <SelectionProvider
        className={cn(
          "relative my-8 flex flex-col gap-4",
          "justify-center",
          "items-center",
          "",
          "xl:flex-row xl:items-stretch",
        )}
      >
        <div className="prose dark:prose-invert ml-2 flex-1">
          {h2.steps.map((step, i) => (
            <Selectable
              key={i}
              index={i}
              selectOn={["click", "scroll"]}
              className={cn(
                "mb-24 border-l-4 px-6 py-2",
                "data-[selected=true]:border-link min-h-100",
                "flex items-center",
              )}
            >
              <div className="my-8">
                {step.title && (
                  <h3 className="mt-4 text-xl">{step.title}</h3>
                )}
                <div className="text-balance">{step.children}</div>
              </div>
            </Selectable>
          ))}
        </div>

        <div
          className={cn(
            "w-full grow",
            "bg-code sticky right-0 bottom-0 left-0 h-[50svh]",
            "",
            "xl:h-[initial] xl:max-w-3xl",
            "xl:relative xl:w-fit xl:bg-transparent",
            "",
            // "relative max-w-3xl grow",
          )}
        >
          <div
            className={cn(
              "flex h-full justify-center",
              // "overflow-y-hidden",
              "items-center",
              "no-scrollbar",
              "xl:sticky xl:top-1/2 xl:h-[initial] xl:-translate-y-1/2",
              "xl:block",
              // "xl:max-h-[60svh]",
            )}
          >
            <Selection
              from={h2.steps.map((step) => (
                <Code codeblock={step.code} key={"key"} />
              ))}
            />
          </div>
        </div>
      </SelectionProvider>
    </section>
  )
})}
  
*/

{
  /* <div className="prose dark:prose-invert">
        {steps.map((step, i) => (
          <Selectable
            key={i}
            index={i}
            selectOn={["click", "scroll"]}
            className={cn(
              "mb-24 border-l-4 px-6 py-2",
              "data-[selected=true]:border-link min-h-100",
              "flex items-center",
            )}
          >
            <div className="my-8">
              <h2 className="mt-4 text-xl">{step.title}</h2>
              <div>{step.children}</div>
            </div>
          </Selectable>
        ))}
      </div> */
}

{
  /* <div className={cn("w-[42vw] max-w-2xl")}>
        <div className="no-scrollbar sticky top-1/2 -translate-y-1/2">
          <Selection
            from={steps.map((step) => (
              <Code codeblock={step.code} key={"key"} />
            ))}
          />
        </div>
      </div> */
}
