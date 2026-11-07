import ContactForm from '../components/ContactForm'
import PageHeading from '../components/PageHeading'
import { usePageTitle } from '../hooks/usePageTitle'

export default function ContactPage() {
  usePageTitle('Contacto')

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[5fr_7fr]">
        <div>
          <PageHeading
            title="Contacto"
            description="¿Tienes preguntas o sugerencias? Escríbelas aquí y revisa el mensaje antes de confirmarlo."
          />
          <aside className="rounded-md border border-line p-4 text-sm text-muted">
            <p>
              <strong className="text-ink">Esto es una demostración.</strong> El formulario valida y
              confirma tus datos en el navegador, pero no los envía a ningún servidor ni correo.
            </p>
          </aside>
        </div>

        <div className="rounded-md border border-line bg-surface p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
