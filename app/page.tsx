'use client'

import { useMemo, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import '../src/App.css'
import { UsersList } from '@/src/components/UsersList'
import { SortBy, type User, type APIResults } from '@/src/types.d'

const ITEMS_PER_PAGE = 10
const API_URL = 'https://rickandmortyapi.com/api/character'

export default function Home () {
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [searchName, setSearchName] = useState<string>('')

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.SPECIES : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage: APIResults, allPages: APIResults[]) => {
      return lastPage.info.next ? allPages.length + 1 : undefined
    }
  } as any)

  const allUsers = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page: any) => page.results)
  }, [data])

  const displayedUsers = useMemo(() => {
    if (!data?.pages) return []
    return allUsers.slice(0, (data.pages as any).length * ITEMS_PER_PAGE)
  }, [allUsers, data?.pages])

  const searchedUsers = useMemo(() => {
    console.log('calculate searchedUsers')
    if (searchName.trim() === '') return allUsers
    
    return allUsers.filter((user: User) => {
      return user.name.toLowerCase().includes(searchName.toLowerCase())
    })
  }, [allUsers, searchName])

  const filteredUsers = useMemo(() => {
    console.log('calculate filteredUsers')
    return filterCountry != null && filterCountry.length > 0
      ? searchedUsers.filter((user: User) => {
        return user.species.toLowerCase().includes(filterCountry.toLowerCase())
      })
      : searchedUsers
  }, [searchedUsers, filterCountry])

  const sortedUsers = useMemo(() => {
    console.log('calculate sortedUsers')

    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.SPECIES]: user => user.species,
      [SortBy.NAME]: user => user.name,
      [SortBy.STATUS]: user => user.status
    }

    return filteredUsers.toSorted((a: User, b: User) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  const handleDelete = (id: number) => {
    refetch()
  }

  const handleReset = () => {
    refetch()
  }

  return (
    <>
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={toggleColors}>
          Colorear files
        </button>

        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.SPECIES ? 'No ordenar por especie' : 'Ordenar por especie'}
        </button>

        <button onClick={handleReset}>
          Resetear estado
        </button>

        <input 
          placeholder='Buscar por nombre' 
          onChange={(e) => setSearchName(e.target.value)}
          value={searchName}
        />
      </header>
      <main>
        {filteredUsers.length > 0 && <UsersList changeSorting={handleChangeSort} deleteUser={handleDelete} showColors={showColors} users={searchName === '' ? sortedUsers.slice(0, ((data?.pages as any)?.length ?? 1) * ITEMS_PER_PAGE) : sortedUsers} />}
        {isLoading && <p>Cargando...</p>}
        {isError && <p>Ha habido un error</p>}
        {!isLoading && !isError && filteredUsers.length == 0 && <p>No se encontraron usuarios</p>}
        
        {!isLoading && !isError && hasNextPage && searchName === '' && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              onClick={() => fetchNextPage()} 
              disabled={isFetchingNextPage}
              style={{ padding: '0.8em 1.6em', fontSize: '1.1em' }}
            >
              {isFetchingNextPage ? 'Cargando...' : 'Cargar más resultados'}
            </button>
          </div>
        )}

        {!isLoading && !isError && !hasNextPage && displayedUsers.length > 0 && (
          <div style={{ marginTop: '2rem', textAlign: 'center', color: '#888' }}>
            <p>Has llegado al final de los resultados</p>
          </div>
        )}
      </main>
    </>
  )
}
