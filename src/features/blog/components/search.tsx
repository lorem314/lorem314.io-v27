"use client"

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useContext } from "./context"

export function Search() {
  const { searchTerm, onSearchTermChange } = useContext()

  return (
    <Card className="col-span-full md:col-span-6">
      <CardHeader>
        <CardTitle>搜索</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          id="blog-search"
          type="search"
          value={searchTerm}
          onChange={(event) => {
            console.log("event.target.value", event.target.value)
            onSearchTermChange(event.target.value)
          }}
        />
      </CardContent>
    </Card>
  )
}
