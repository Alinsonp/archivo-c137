import type { CharacterSummary } from '../types/character'
import CharacterCard from './CharacterCard'

interface CharacterGridProps {
  characters: CharacterSummary[]
  from?: string
}

/** Rejilla responsive: 1 columna en móvil, 2 en tablet, 3 en escritorio y 4 en pantallas amplias. */
export default function CharacterGrid({ characters, from }: CharacterGridProps) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {characters.map((character) => (
        <li key={character.id}>
          <CharacterCard character={character} from={from} />
        </li>
      ))}
    </ul>
  )
}
