"use client"

import React from "react"
import { ProgressProvider } from "@bprogress/next/app"

import { Header } from "./header"
import { Footer } from "./footer"
import { SideNav } from "./side-nav"
import { Drawer, useDrawer } from "@/components/ui/drawer.legacy"

import { useIsClient } from "@/hooks/use-is-client"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { GlobalContext } from "./global-context"

import type { BaseColor, PreferredTheme, Theme } from "@/types"

export function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isClient = useIsClient()

  const [theme, setTheme] = React.useState<Theme>("light")
  const [preferredTheme, setPreferredTheme] = useLocalStorage<PreferredTheme>(
    "preferred-theme",
    "system",
  )

  const [baseColor, setBaseColor] = useLocalStorage<BaseColor>(
    "base-color",
    "neutral",
  )

  const [isLeftDrawerAlwaysCollapsed, setIsLeftDrawerAlwaysCollapsed] =
    useLocalStorage("is-left-drawer-always-collapsed", false)

  const {
    isCollapsed: isLeftDrawerCollapsed,
    isOpen: isLeftDrawerOpen,
    handler: leftDrawerHandler,
  } = useDrawer({
    isAlwaysCollapsed: isLeftDrawerAlwaysCollapsed,
    mediaQuery: "(max-width: 128rem)",
  })

  const showLeftDrawerOpener =
    isLeftDrawerAlwaysCollapsed || isLeftDrawerCollapsed

  const drawerWidth = "420px"

  // theme
  React.useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleThemeChange = ({ matches }: { matches: boolean }) => {
      if (matches) {
        document.documentElement.setAttribute("data-theme", "dark")
        setTheme("dark")
      } else {
        document.documentElement.setAttribute("data-theme", "light")
        setTheme("light")
      }
    }

    if (preferredTheme === "system") {
      darkQuery.addEventListener("change", handleThemeChange)
      const theme = darkQuery.matches ? "dark" : "light"
      document.documentElement.setAttribute("data-theme", theme)
      setTheme(theme)
    } else {
      document.documentElement.setAttribute("data-theme", preferredTheme)
      setTheme(preferredTheme)
    }

    return () => {
      darkQuery.removeEventListener("change", handleThemeChange)
    }
  }, [preferredTheme])

  // base color
  React.useEffect(() => {
    document.documentElement.setAttribute("data-base-color", baseColor)
  }, [baseColor])

  return (
    <>
      <ProgressProvider
        height="2px"
        color="#ff0000"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {isClient ? (
        <div className="flex min-h-svh flex-col">
          <GlobalContext.Provider
            value={{
              preferredTheme,
              setPreferredTheme,
              isLeftDrawerAlwaysCollapsed,
              setIsLeftDrawerAlwaysCollapsed,
              baseColor,
              setBaseColor,
            }}
          >
            <Header
              showLeftDrawerOpener={showLeftDrawerOpener}
              openLeftDrawer={leftDrawerHandler.open}
            />

            <div className="flex min-h-[calc(100vh-64px)]">
              {showLeftDrawerOpener ? (
                <Drawer
                  isOpen={isLeftDrawerOpen}
                  onClose={leftDrawerHandler.close}
                  side="left"
                  size={drawerWidth}
                >
                  {({ closeDrawer }) => {
                    return <SideNav closeDrawer={closeDrawer} />
                  }}
                </Drawer>
              ) : (
                <aside
                  className="bg-sidebar sticky top-16 h-[calc(100vh-64px)] shrink-0 overflow-auto border-r"
                  style={{ width: drawerWidth }}
                >
                  <SideNav />
                </aside>
              )}

              <main className="flex min-w-0 grow flex-col">
                <div className="my-16 grow px-4">{children}</div>
                <Footer />
              </main>
            </div>
          </GlobalContext.Provider>
        </div>
      ) : null}
    </>
  )
}
