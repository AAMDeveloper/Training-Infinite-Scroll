'use client'

import Link from 'next/link'
import { SortBy, type User } from '../types.d'

interface Props {
  changeSorting: (sort: SortBy) => void
  deleteUser: (id: number) => void
  showColors: boolean
  users: User[]
}

export function UsersList ({ changeSorting, deleteUser, showColors, users }: Props) {
  return (
    <table width='100%'>
      <thead>
        <tr>
          <th>Imagen</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.NAME) }}>Nombre</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.STATUS) }}>Estado</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.SPECIES) }}>Especie</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody className={showColors ? 'table--showColors' : ''}>
        {
          users.map((user) => {
            return (
              <tr key={user.id} style={{ cursor: 'pointer' }}>
                <td>
                  <Link href={`/character/${user.id}`}>
                    <img src={user.image} style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                  </Link>
                </td>
                <td>
                  <Link href={`/character/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {user.name}
                  </Link>
                </td>
                <td>
                  <Link href={`/character/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {user.status}
                  </Link>
                </td>
                <td>
                  <Link href={`/character/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {user.species}
                  </Link>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => {
                    deleteUser(user.id)
                  }}>Eliminar</button>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}
