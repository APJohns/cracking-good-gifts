import '~/styles/global.css'

import type { AppProps } from 'next/app'
import {
  IBM_Plex_Mono,
  Montserrat,
  PT_Serif,
  Viaoda_Libre,
} from 'next/font/google'
import { Dispatch, SetStateAction, createContext, lazy, useEffect, useState } from 'react'
import { type Product } from '~/lib/sanity.queries'

export interface SharedPageProps {
  draftMode: boolean
  token: string
}

const PreviewProvider = lazy(() => import('~/components/PreviewProvider'))

interface ProductExtended extends Product {
  quantity: number
}

interface Cart {
  [key: string]: ProductExtended
}

interface CartContextI {
  cart: Cart
  setCart: Dispatch<SetStateAction<Cart>>
  addToCart: (product: Product, quantity?: number) => Cart
  removeFromCart: (productId: string) => Cart
  updateQuantity: (productId: string, quantity: number) => Cart
}

export const CartContext = createContext<CartContextI>(null);

const mono = IBM_Plex_Mono({
  variable: '--font-family-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
})

const sans = Montserrat({
  variable: '--font-family-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const display = Viaoda_Libre({
  variable: '--font-family-display',
  subsets: ['latin'],
  weight: ['400'],
})

const serif = PT_Serif({
  variable: '--font-family-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function App({
  Component,
  pageProps,
}: AppProps<SharedPageProps>) {
  const { draftMode, token } = pageProps

  const [cart, setCart] = useState<Cart>({});

  const addToCart = (product, quantity = 1) => {
    const tempCart = {...cart}
    tempCart[product._id] = {
      ...product,
      quantity,
    }
    setCart(tempCart)
    return cart
  }

  const updateQuantity = (productId, quantity) => {
    const tempCart = {...cart}
    if (tempCart[productId] && quantity !== cart[productId].quantity) {
      tempCart[productId].quantity = quantity
      setCart(tempCart)
    }
    return cart
  }

  const removeFromCart = (productId) => {
    const tempCart = {...cart}
    delete tempCart[productId]
    setCart(tempCart)
    return cart
  }

  useEffect(() => {
    if (localStorage.getItem('cart')) {
      setCart(JSON.parse(localStorage.getItem('cart')))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  return (
    <CartContext.Provider value={{cart, setCart, addToCart, removeFromCart, updateQuantity}}>
      <style jsx global>
        {`
          :root {
            --font-family-sans: ${sans.style.fontFamily};
            --font-family-serif: ${serif.style.fontFamily};
            --font-family-display: ${display.style.fontFamily};
            --font-family-mono: ${mono.style.fontFamily};
          }
        `}
      </style>
      {draftMode ? (
        <PreviewProvider token={token}>
          <Component {...pageProps} />
        </PreviewProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </CartContext.Provider>
  )
}
