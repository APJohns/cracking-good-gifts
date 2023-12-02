import { useEffect, useState } from 'react'

import { getCart } from '~/utils'

export default function useCart() {
  const [cartItems, setCartItems] = useState({})

  useEffect(() => {
    const syncCart = () => {
      setCartItems(getCart())
    }
    syncCart()

    window.addEventListener('storage', syncCart)

    return () => {
      window.removeEventListener('storage', syncCart)
    }
  }, [])

  return cartItems
}
