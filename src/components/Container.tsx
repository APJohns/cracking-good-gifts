import Link from 'next/link'

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-body standard-padding-x">
          <p className="footer-brand">Cracking Good Gifts</p>
          <div className="footer-contact">
            <a href="mailto:support@crackinggoodgifts.com">support@crackinggoodgifts.com</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
