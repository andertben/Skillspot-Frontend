
export default function DatenschutzPage() {

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Datenschutz</h1>

      <div className="prose prose-invert max-w-none space-y-6 text-neutral-300">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-neutral-100">1. Datenschutzerklärung</h2>
          <p>
            Die Technische Hochschule Brandenburg nimmt den Schutz Ihrer Daten sehr ernst.
            Diese Datenschutzerklärung erläutert, wie wir Ihre persönlichen Daten erfassen,
            verwenden und schützen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-neutral-100">2. Datenerfassung</h2>
          <p>
            Skillspot ist ein studentisches Projekt und erfasst Daten nur in dem Umfang,
            der für die Funktionalität erforderlich ist. Diese Daten können umfassen:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Benutzerkonto-Informationen (Name, E-Mail)</li>
            <li>Standortinformationen (mit Ihrer Zustimmung)</li>
            <li>Nutzungsdaten zu Statistik- und Fehlerbehebungszwecken</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-neutral-100">3. Datensicherheit</h2>
          <p>
            Ihre Daten werden mit modernen Sicherheitsmaßnahmen geschützt.
            Die Authentifizierung erfolgt über Auth0, einen zertifizierten Anbieter.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-neutral-100">4. Ihre Rechte</h2>
          <p>
            Sie haben das Recht, Ihre Daten zu sehen, zu ändern oder zu löschen.
            Kontaktieren Sie uns unter <a href="mailto:info@skillspot.de" className="text-primary hover:underline">info@skillspot.de</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-neutral-100">5. Externe Dienste</h2>
          <p>
            Diese Anwendung nutzt Auth0 für die Authentifizierung.
            Bitte beachten Sie auch deren Datenschutzerklärung.
          </p>
        </section>
      </div>
    </div>
  )
}
