import Image from 'next/image'
import { useContext, useEffect, useRef, useState } from 'react'

import { urlForImage } from '~/lib/sanity.image'
import { type Product } from '~/lib/sanity.queries'
import styles from '~/styles/card.module.css'

import InputQuantity from './InputQuantity'
import { CartContext } from '~/pages/_app'

export default function Card({ product }: { product: Product }) {
  const {cart, addToCart, updateQuantity} = useContext(CartContext)
  const [inCart, setInCart] = useState(false)

  const quantityRef = useRef(null)

  useEffect(() => {
    setInCart(!!cart[product._id])
  }, [cart, product._id])

  return (
    <div className={styles.card}>
      <div className={styles.cover}>
        <Image
          className={styles.image}
          src={urlForImage(product.image).width(500).height(500).url()}
          height={500}
          width={500}
          alt=""
        />
      </div>
      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {/* <a href={`/post/${post.slug.current}`}> */}
            {product.title}
            {/* </a> */}
          </h3>
          <p className={styles.price}>${product.price}</p>
        </div>
        <div className={styles.addToCart}>
          <InputQuantity
            ref={quantityRef}
            onChange={() =>
              updateQuantity(product._id, quantityRef.current.value)
            }
          />
          <button
            type="button"
            className="btn"
            disabled={inCart}
            onClick={() =>
              addToCart(product, Number(quantityRef.current.value))
            }
          >
            {inCart ? '✔' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
