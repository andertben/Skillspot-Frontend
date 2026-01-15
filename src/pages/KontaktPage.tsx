import { useTranslation } from 'react-i18next'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function KontaktPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Kontakt</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Haben Sie Fragen zu Skillspot? Kontaktieren Sie uns!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex gap-4">
            <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">E-Mail</h3>
              <a href="mailto:info@skillspot.de" className="text-primary hover:underline">
                info@skillspot.de
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Adresse</h3>
              <p className="text-neutral-300">
                Technische Hochschule Brandenburg<br />
                14770 Brandenburg an der Havel<br />
                Deutschland
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Telefon</h3>
              <p className="text-neutral-300">
                Skillspot Support<br />
                <a href="tel:+491234567890" className="text-primary hover:underline">
                  +49 (0) 123 - 456789
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6" style={{ borderColor: 'hsl(var(--border))' }}>
          <h3 className="text-xl font-semibold mb-4">Über das Projekt</h3>
          <p className="text-neutral-300 space-y-4">
            <span className="block">
              Skillspot ist ein studentisches Projekt der Technischen Hochschule Brandenburg.
              Das Projekt wurde entwickelt, um eine Plattform zur Vermittlung von Dienstleistungen
              und Fähigkeiten in der Region zu schaffen.
            </span>
            <span className="block">
              Für weitere Informationen kontaktieren Sie uns per E-Mail oder besuchen Sie
              die Hochschule persönlich.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
