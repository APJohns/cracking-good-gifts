import { Viaoda_Libre } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import useCart from '~/hooks/useCart'
import { urlForImage } from '~/lib/sanity.image'
import { removeFromCart } from '~/utils'

import Cart from './icons/Cart'
import Remove from './icons/Remove'

const viaoda = Viaoda_Libre({ weight: '400', subsets: ['latin'] })

interface Props {
  hasNav?: boolean
  heading?: string
  children: React.ReactNode
}

export default function Container({ heading, children }: Props) {
  const cart = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className="container">
      <header className="header">
        <nav className="navPrimary">
          <Link href="/" className={`logo ${viaoda.className}`}>
            Cracking Good Gifts
          </Link>
          <ul className="navList">
            {/* TODO: Uncomment link when all rpoducts page is setup */}
            {/* <li><Link href="/products">Shop</Link></li> */}
            <li className="cartContainer">
              <button
                type="button"
                className="cartBtn"
                aria-haspopup="true"
                aria-label={`${isCartOpen ? 'close' : 'open'} cart`}
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <Cart />
              </button>
              <div
                className={`cart${isCartOpen ? ' open' : ''}`}
                aria-expanded={isCartOpen}
              >
                {Object.keys(cart).length > 0 ? (
                  <>
                    <ul>
                      {Object.keys(cart).map((item) => (
                        <li key={cart[item]._id} className="cartItem">
                          <Image
                            className="cartItemImage"
                            src={urlForImage(cart[item].image)
                              .width(75)
                              .height(75)
                              .url()}
                            height={75}
                            width={75}
                            alt=""
                          />
                          <div className="cartItemDetails">
                            <p className="cartItemTitle">{cart[item].title}</p>
                            <p aria-label={`Quantity: ${cart[item].quantity}`}>
                              Qty: {cart[item].quantity}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="cartItemRemove"
                            aria-label="remove product from cart"
                            onClick={() => removeFromCart(item)}
                          >
                            <Remove />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <Link href="/checkout" className="btn cartCheckout">
                      Checkout
                    </Link>
                  </>
                ) : (
                  <p className="cartEmpty">Your cart is empty</p>
                )}
              </div>
            </li>
          </ul>
        </nav>
        {heading && <h1 className="standard-padding-x">{heading}</h1>}
      </header>
      {/* {heading && <h1 className="heading">{heading}</h1>} */}
      <main>{children}</main>
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
