import { Viaoda_Libre } from 'next/font/google'
import Link from 'next/link'

const viaoda = Viaoda_Libre({ weight: '400', subsets: ['latin'] })

interface Props {
  isConstrained?: boolean
  hasTagline?: boolean
  heading?: string
  children: React.ReactNode
}

export default function Container({
  isConstrained = true,
  hasTagline = true,
  heading,
  children,
}: Props) {
  return (
    <div className="container">
      <header className="hero">
        <Link href="/" className={`title ${viaoda.className}`}>
          {heading ? <p>Cracking Good Gifts</p> : <h1>Cracking Good Gifts</h1>}
        </Link>
        {hasTagline && (
          <p className="tagline">
            Crafting a better world
            <br />
            One gift at a time
          </p>
        )}
        {heading && <h1 className="heading">{heading}</h1>}
      </header>
      <main className={isConstrained ? 'constrained' : undefined}>
        {children}
      </main>
      <footer className="footer">
        <div className="footer-body standard-padding-x">
          <p className="footer-brand">Cracking Good Gifts</p>
          <div className="footer-contact">
            <a href="mailto:support@crackinggoodgifts.com">
              support@crackinggoodgifts.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
