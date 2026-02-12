import { type User } from '../types.d'

const API_URL = 'https://rickandmortyapi.com/api/character'

export async function fetchAllUsers (page: number = 1): Promise<User[]> {
  try {
    const response = await fetch(`${API_URL}?page=${page}`)
    if (!response.ok) throw new Error('Error en la API')
    
    const data = await response.json()
    return data.results
  } catch (err) {
    console.error("Error al obtener usuarios:", err)
    throw err
  }
}

export async function fetchUserById (id: number): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) throw new Error('Usuario no encontrado')
    
    return await response.json()
  } catch (err) {
    console.error(`Error al obtener usuario ${id}:`, err)
    return null
  }
}

/**
 * Calcula el total de usuarios cargados en pantalla
 * @param pages - Array de arrays con usuarios de cada página
 * @returns Total de usuarios cargados
 */
export function getTotalUsersLoaded (pages: User[][]): number {
  if (!pages || pages.length === 0) return 0
  return pages.flat().length
}

/**
 * Calcula cuántos usuarios se están mostrando actualmente
 * @param totalLoaded - Total de usuarios cargados
 * @param itemsPerPage - Cantidad de items a mostrar por página
 * @param currentPage - Página actual
 * @returns Total de usuarios mostrados
 */
export function getDisplayedUsersCount (
  totalLoaded: number,
  itemsPerPage: number = 5,
  currentPage: number = 1
): number {
  return Math.min(totalLoaded, currentPage * itemsPerPage)
}
