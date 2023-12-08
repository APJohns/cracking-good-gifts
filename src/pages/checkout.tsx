import Image from 'next/image'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types'
import { useContext, useEffect, useState } from 'react'

import Container from '~/components/Container'
import Remove from '~/components/icons/Remove'
import InputQuantity from '~/components/InputQuantity'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { urlForImage } from '~/lib/sanity.image'
import { Category, getCategories } from '~/lib/sanity.queries'
import styles from '~/styles/checkout.module.css'

import { CartContext, SharedPageProps } from './_app'

export const getServerSideProps: GetServerSideProps<
  SharedPageProps & {
    categories: Category[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const categories = await getCategories(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      categories,
    },
  }
}

export default function Checkout(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext)

  const [orderId, setOrderId] = useState<number>()

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

  const stringifyCart = (): string => {
    const findCategoryById = (categoryId: string): string => {
      return props.categories.find((category) => category._id === categoryId)
        .title
    }
    const products = Object.keys(cart).map(
      (product) =>
        `${cart[product].quantity}x ${cart[product].title} (${findCategoryById(
          cart[product].category._ref,
        )}) $${cart[product].price}ea`,
    )
    products.push(`Total: $${getTotal()}`)
    console.log(products.join('\n'))
    return products.join('\n')
  }

  useEffect(() => {
    setOrderId(Date.now())
  }, [])

  return (
    <Container>
      <h1 className="page-heading standard-padding-x">Checkout</h1>
      <div className={`${styles.checkoutLayout} standard-padding-x`}>
        <section className={styles.orderSummary}>
          <h2>Order Summary</h2>
          <dl>
            <dt>Order ID:</dt>
            <dd>{orderId}</dd>
          </dl>
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
                    className={styles.productQuantity}
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
        <section>
          <h2>Submit Order</h2>
          <p>
            We are currently only accepting payment via donation. Your order will
            not be fulfilled until a donation of the amount quoted here is made to
            our{' '}
            <a href="http://danafarber.jimmyfund.org/goto/DavidJohns" className="link">
              Dana-Farber fundraiser page
            </a>
            .
          </p>
          <form action="https://usebasin.com/f/c2d55604b0ee" method="POST" className={styles.orderForm}>
            <input type="hidden" name="id" value={orderId} />
            <input type="hidden" name="order" value={stringifyCart()} />
            <div className={styles.orderFormGrid}>
              <label className={styles.orderFormControl}>
                <div className={styles.formControlLabel}>Name</div>
                <input type="text" name="name" required />
              </label>
              <label className={styles.orderFormControl}>
                <div className={styles.formControlLabel}>Email</div>
                <input type="email" name="email" required />
              </label>
              <label className={styles.orderFormControl}>
                <div className={styles.formControlLabel}>Address</div>
                <textarea name="address" required />
              </label>
              <label className={styles.orderFormControl}>
                <div className={styles.formControlLabel}>Notes</div>
                <textarea name="notes" />
              </label>
              <button type="submit" className='btn'>Submit Order</button>
            </div>
          </form>
        </section>
      </div>
    </Container>
  )
}
