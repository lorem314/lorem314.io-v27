import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { Pre, highlight } from "codehike/code"
import { z } from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type { AnnotationHandler, BlockAnnotation, RawCode } from "codehike/code"
import { cn } from "@/lib/utils"

import { CopyButton } from "./annotations/copy-button"

type CodeWithTabsProp = { tabs: [] }

const Schema = Block.extend({ tabs: z.array(CodeBlock) })

export async function CodeWithTabs(props: CodeWithTabsProp) {
  const { tabs } = parseProps(props, Schema) as { tabs: RawCode[] }
  return <CodeTabs tabs={tabs} />
}

async function CodeTabs(props: { tabs: RawCode[] }) {
  const { tabs } = props
  const highlighted = await Promise.all(
    tabs.map((tab) => highlight(tab, "github-from-css")),
  )
  return (
    <Tabs defaultValue={tabs[0]?.meta} className="my-4 gap-0 rounded">
      <TabsList className="bg-card flex h-fit flex-wrap justify-start rounded-none p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.meta}
            value={tab.meta}
            className={cn(
              "bg-card grow-0 cursor-pointer rounded-none",
              "data-[state=active]:border",
              "data-[state=active]:border-input",
              "data-[state=active]:bg-code",
              "data-[state=active]:shadow-none",
            )}
          >
            {tab.meta}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, i) => (
        <TabsContent
          key={tab.meta}
          value={tab.meta}
          className="group relative mt-0"
        >
          <Pre code={highlighted[i]} className="bg-code m-0! rounded-none" />
          <CopyButton
            className="invisible group-hover:visible"
            text={highlighted[i].code}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
