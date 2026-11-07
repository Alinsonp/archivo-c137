import Hero from '../components/Hero'
import { usePageTitle } from '../hooks/usePageTitle'

const CAPABILITIES = [
  {
    title: 'Busca mientras escribes',
    text: 'Escribe un nombre y la lista se actualiza sola, sin botón de enviar.',
  },
  {
    title: 'Filtra por estado',
    text: 'Combina la búsqueda con vivo, muerto o desconocido para acotar los resultados.',
  },
  {
    title: 'Guarda lo que te importa',
    text: 'Tus favoritos te acompañan entre páginas y siguen ahí después de recargar.',
  },
] as const

export default function HomePage() {
  usePageTitle()

  return (
    <>
      <Hero />

      <section
        aria-labelledby="capabilities-title"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <h2 id="capabilities-title" className="title-card text-5xl sm:text-6xl">
          Todo el archivo, a tu ritmo
        </h2>

        <ul className="mt-10 grid border-t border-line md:grid-cols-3 md:divide-x md:divide-line">
          {CAPABILITIES.map((item) => (
            <li
              key={item.title}
              className="border-b border-line py-8 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-2 max-w-sm text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
