import Image from 'next/image'
import { useState } from 'react'

import Container from '~/components/Container'
import Remove from '~/components/icons/Remove'
import InputQuantity from '~/components/InputQuantity'
import useCart from '~/hooks/useCart'
import { urlForImage } from '~/lib/sanity.image'
import styles from '~/styles/checkout.module.css'
import { removeFromCart, updateQuantity } from '~/utils'

export default function Checkout() {
  const cart = useCart()

  const [checkoutCart, setCheckoutCart] = useState(cart)

  const getTotal = () => {
    return Object.keys(cart).reduce(
      (acc, cur) => acc + Number(cart[cur].quantity) * Number(cart[cur].price),
      0,
    )
  }

  const handleChange = (productId, quantity) => {
    if (quantity !== Number(cart[productId].quantity)) {
      updateQuantity(productId, quantity)
    }
  }

  return (
    <Container>
      <h1 className="page-heading standard-padding-x">Checkout</h1>
      <section className="standard-padding-x">
        <h2>Order Summary</h2>
        <ul className={styles.orderList}>
          {Object.keys(cart).map((product) => (
            <li key={cart[product]._id} className={styles.product}>
              <Image
                className="cartItemImage"
                src={urlForImage(cart[product].image)
                  .width(100)
                  .height(100)
                  .url()}
                height={100}
                width={100}
                alt=""
              />
              <div className={styles.productDetails}>
                <p className={styles.productPrice}>
                  ${cart[product].price * cart[product].quantity}
                </p>
                <p>{cart[product].title}</p>
                <InputQuantity
                  defaultValue={Number(cart[product].quantity)}
                  onChange={(quantity) => handleChange(product, quantity)}
                />
              </div>
              <button
                type="button"
                className={`cartItemRemove ${styles.productRemove}`}
                aria-label="remove product from cart"
                onClick={() => removeFromCart(product)}
              >
                <Remove />
              </button>
            </li>
          ))}
        </ul>
        <dl>
          <dt>Total</dt>
          <dd>${getTotal()}</dd>
        </dl>
      </section>
      <section className="standard-padding-x">
        <h2>Submit Order</h2>
        <p>
          We are currently only accepting payment via donation. Your order will
          not be fulfilled until a donation of the amount quoted here is made to{' '}
          <a href="https://danafarber.jimmyfund.org/site/TR?fr_id=2100&pg=personal&px=2308569">
            our Dana-Farber fundraiser page
          </a>
          .
        </p>
      </section>
    </Container>
  )
}
