
export default function ImpressumPage() {

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Impressum</h1>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
          <p>
            Skillspot<br />
            Technische Hochschule Brandenburg<br />
            Brandenburg an der Havel<br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
          <p>
            E-Mail: <a href="mailto:info@skillspot.de" className="text-primary hover:underline">info@skillspot.de</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Verantwortlich für den Inhalt</h2>
          <p>
            Skillspot ist ein studentisches Projekt der Technischen Hochschule Brandenburg.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Haftungsausschluss</h2>
          <p>
            Die Inhalte dieser Website werden mit großer Sorgfalt erarbeitet. Für die Vollständigkeit,
            Richtigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Externe Links</h2>
          <p>
            Diese Website enthält Verweise auf externe Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
          </p>
        </section>
      </div>
    </div>
  )
}
