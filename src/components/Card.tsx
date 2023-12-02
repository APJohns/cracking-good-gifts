import Image from 'next/image'
import { useEffect, useState } from 'react'

import useCart from '~/hooks/useCart'
import { urlForImage } from '~/lib/sanity.image'
import { type Product } from '~/lib/sanity.queries'
import styles from '~/styles/card.module.css'
import { addToCart } from '~/utils'

export default function Card({ product }: { product: Product }) {
  const cart = useCart()
  const [inCart, setInCart] = useState(false)

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
          <button
            type="button"
            className="btn"
            disabled={inCart}
            onClick={() => addToCart(product)}
          >
            {inCart ? '✔' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
