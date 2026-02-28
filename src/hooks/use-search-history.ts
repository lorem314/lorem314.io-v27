import { useLocalStorage } from "./use-local-storage"

type HistoryItem = {
  title: string
  summary: string
}

const HISTORY_LENGTH = 5

export const useSearchHistory = () => {
  const [history, setHistory] = useLocalStorage(
    "search-history",
    [] as HistoryItem[],
  )

  const add = (item: HistoryItem) => {
    try {
      const newHistory = [...history, item]

      setHistory(
        newHistory.length > HISTORY_LENGTH
          ? newHistory.slice(newHistory.length - HISTORY_LENGTH)
          : newHistory,
      )
    } catch (error) {
      console.error("[useSearchHistory] add", error)
    }
  }

  const remove = (title: string) => {
    try {
      const newHistory = history.filter((item) => item.title !== title)
      setHistory(newHistory)
    } catch (error) {
      console.error("[useSearchHistory] remove", error)
    }
  }

  return { list: history, add, remove }
}
