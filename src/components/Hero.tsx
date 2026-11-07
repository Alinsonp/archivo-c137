import { Link } from 'react-router-dom'
import { buttonClass } from '../utils/buttonStyles'
import FeaturedPosters from './FeaturedPosters'

/** Hero del inicio: título de cartel, propósito en una frase y llamada a la acción. */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="projector absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div>
          <h1 id="hero-title" className="title-card break-words text-[clamp(3.5rem,10.5vw,8.5rem)]">
            <span className="block">El multiverso</span>
            <span className="block">en cartelera</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted sm:text-xl">
            Busca entre los personajes de Rick and Morty, filtra por estado y guarda tus
            favoritos. Los datos llegan en vivo desde la API pública.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/explorar" className={`${buttonClass('primary', 'lg')} w-full sm:w-auto`}>
              Explorar personajes
            </Link>
            <Link to="/favoritos" className={`${buttonClass('secondary', 'lg')} w-full sm:w-auto`}>
              Ver mis favoritos
            </Link>
          </div>
        </div>

        <FeaturedPosters />
      </div>
    </section>
  )
}
