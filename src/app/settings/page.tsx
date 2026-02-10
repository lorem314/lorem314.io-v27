"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { useGlobalContext } from "@/components/layout/global-context"
import type { BaseColor, PreferredTheme } from "@/types"

export default function Settings() {
  const {
    preferredTheme,
    setPreferredTheme,
    isLeftDrawerAlwaysCollapsed,
    setIsLeftDrawerAlwaysCollapsed,
    baseColor,
    setBaseColor,
  } = useGlobalContext()

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>设置</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldSet>
          <Field orientation="horizontal">
            <FieldLabel>主题</FieldLabel>
            <Select
              value={preferredTheme}
              onValueChange={(preferredTheme) => {
                setPreferredTheme(preferredTheme as PreferredTheme)
              }}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="选择主题" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>主题</SelectLabel>
                  <SelectItem value="light">白天</SelectItem>
                  <SelectItem value="dark">黑夜</SelectItem>
                  <SelectItem value="system">系统</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="is-left-drawer-always-collapsed">
              基础色
            </FieldLabel>
            <Select
              value={baseColor}
              onValueChange={(baseColor) => {
                setBaseColor(baseColor as BaseColor)
              }}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="选择配色" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>基础色</SelectLabel>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="stone">Stone</SelectItem>
                  <SelectItem value="zinc">Zinc</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="slate">Slate</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="is-left-drawer-always-collapsed"
              className="size-5"
              checked={isLeftDrawerAlwaysCollapsed}
              onCheckedChange={(checked) => {
                setIsLeftDrawerAlwaysCollapsed(checked as boolean)
              }}
            />
            <FieldLabel htmlFor="is-left-drawer-always-collapsed">
              总是折叠左侧抽屉
            </FieldLabel>
          </Field>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
