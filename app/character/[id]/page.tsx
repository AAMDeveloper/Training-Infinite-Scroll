'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import type { User } from '@/src/types.d'
import '../character.css'
import CharacterSkeleton from '../loading'

function CharacterContent() {
  const params = useParams()
  const router = useRouter()
  const [character, setCharacter] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${params.id}`)
        if (!response.ok) throw new Error('Error en la API')
        const data: User = await response.json()
        setCharacter(data)
      } catch (err) {
        console.error('Error al obtener el personaje:', err)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCharacter()
  }, [params.id])

  if (isLoading) return <CharacterSkeleton />
  if (isError) return <div className="character-container"><p>Error al cargar el personaje</p></div>
  if (!character) return <div className="character-container"><p>Personaje no encontrado</p></div>

  return (
    <div className="character-container">
      <button onClick={() => router.back()} className="back-button">
        ← Volver
      </button>

      <div className="character-detail">
        <div className="character-image">
          <img src={character.image} alt={character.name} />
        </div>

        <div className="character-info">
          <h1>{character.name}</h1>

          <div className="info-grid">
            <div className="info-item">
              <span className="label">Estado:</span>
              <span className={`status ${character.status.toLowerCase()}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50px', }}>
                {character.status}
              </span>
            </div>

            <div className="info-item">
              <span className="label">Especie:</span>
              <span>{character.species}</span>
            </div>

            <div className="info-item">
              <span className="label">Tipo:</span>
              <span>{character.type || 'N/A'}</span>
            </div>

            <div className="info-item">
              <span className="label">Género:</span>
              <span>{character.gender}</span>
            </div>

            <div className="info-item">
              <span className="label">Origen:</span>
              <span>{character.origin.name}</span>
            </div>

            <div className="info-item">
              <span className="label">Localización:</span>
              <span>{character.location.name}</span>
            </div>

            <div className="info-item full-width">
              <span className="label">Episodios en los que aparece:</span>
              <span>{character.episode.length}</span>
            </div>
          </div>

          <div className="episodes-section">
            <h2>Episodes ({character.episode.length})</h2>
            <ul className="episodes-list">
              {character.episode.slice(0, 10).map((ep, index) => (
                <li key={index}>{ep.split('/').pop()}</li>
              ))}
              {character.episode.length > 10 && (
                <li>... y {character.episode.length - 10} episodios más</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CharacterDetail() {
  return (
    <Suspense fallback={<CharacterSkeleton />}>
      <CharacterContent />
    </Suspense>
  )
}
