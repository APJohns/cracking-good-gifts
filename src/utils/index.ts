export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getCart() {
  if (localStorage.getItem('cart')) {
    return JSON.parse(localStorage.getItem('cart'))
  } else {
    return {}
  }
}

export function addToCart(product, quantity = 1) {
  const cart = getCart()
  cart[product._id] = {
    ...product,
    quantity,
  }
  localStorage.setItem('cart', JSON.stringify(cart))
  dispatchEvent(new Event('storage'))
  return cart
}

export function updateQuantity(productId, quantity) {
  const cart = getCart()
  if (cart[productId]) {
    cart[productId].quantity = quantity
    localStorage.setItem('cart', JSON.stringify(cart))
    dispatchEvent(new Event('storage'))
  }
  return cart
}

export function removeFromCart(productId) {
  const cart = getCart()
  delete cart[productId]
  localStorage.setItem('cart', JSON.stringify(cart))
  dispatchEvent(new Event('storage'))
  return cart
}
