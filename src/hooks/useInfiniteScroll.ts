

import { useState, useEffect, useCallback } from "react"

interface UseInfiniteScrollProps<T> {
  fetchData: (page: number) => Promise<{ data: T[]; hasMore: boolean }>
  initialPage?: number
}

export function useInfiniteScroll<T>({ fetchData, initialPage = 1 }: UseInfiniteScrollProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadData = useCallback(
    async (currentPage: number, refresh = false) => {
      try {
        setIsLoading(true)
        setError(null)

        const result = await fetchData(currentPage)

        setData((prev) => (refresh ? result.data : [...prev, ...result.data]))
        setHasMore(result.hasMore)
        setPage(currentPage + 1)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"))
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [fetchData],
  )

  // Initial load
  useEffect(() => {
    loadData(initialPage)
  }, [loadData, initialPage])

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadData(page)
    }
  }, [isLoading, hasMore, page, loadData])

  const handleRefresh = useCallback(() => {
    if (!isLoading) {
      setIsRefreshing(true)
      loadData(initialPage, true)
    }
  }, [isLoading, initialPage, loadData])

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    handleLoadMore,
    handleRefresh,
    setData,
  }
}
