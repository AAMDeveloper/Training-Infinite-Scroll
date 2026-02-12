import { useInfiniteQuery } from '@tanstack/react-query'
import { type User, type APIResults } from '../types.d'
import { useMemo } from 'react'

const API_URL = 'https://rickandmortyapi.com/api/character'

export function useUsers () {
  const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }): Promise<APIResults> => {
    try {
      const response = await fetch(`${API_URL}?page=${pageParam}`)
      if (!response.ok) throw new Error('Error en la API')
      
      const result: APIResults = await response.json()
      return result
    } catch (err) {
      console.error("Error al obtener datos:", err)
      throw err
    }
  }

  const query = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage: APIResults, allPages: APIResults[]) => {
      return lastPage.info.next ? allPages.length + 1 : undefined
    }
  } as any)

  const totalUsers = useMemo(() => {
    if (!query.data?.pages) return 0
    return query.data.pages.reduce((acc, page: any) => acc + page.results.length, 0)
  }, [query.data?.pages])

  const displayedUsers = useMemo(() => {
    if (!query.data?.pages) return 0
    const pagesLength: number = (query.data.pages as any).length ?? 0
    return Math.min(totalUsers as number, pagesLength * 5)
  }, [totalUsers, query.data?.pages.length])

  return {
    ...query,
    totalUsers,
    displayedUsers
  }
}
