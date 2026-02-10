import React from "react"

import type { PreferredTheme, BaseColor } from "@/types"

type GlobalContextProps = {
  preferredTheme: PreferredTheme
  setPreferredTheme: (arg0: PreferredTheme) => void

  // leftDrawerWidth: number
  // setLeftDrawerWidth: (arg0: number) => void

  baseColor: BaseColor
  setBaseColor: (arg0: BaseColor) => void

  isLeftDrawerAlwaysCollapsed: boolean
  setIsLeftDrawerAlwaysCollapsed: (arg0: boolean) => void

  // isRightDrawerAlwaysCollapsed: boolean
  // setIsRightDrawerAlwaysCollapsed: (arg0: boolean) => void

  // showRightDrawerOpener: boolean
  // isRightDrawerOpen: boolean
  // rightDrawerHandler: { open: () => void; close: () => void }
}

export const GlobalContext = React.createContext<
  GlobalContextProps | undefined
>(undefined)

export const useGlobalContext = () => {
  const globalContext = React.useContext(GlobalContext)

  if (!globalContext) {
    throw new Error(
      "globalContext has to be used within <GlobalContext.Provider>",
    )
  }

  return globalContext
}
