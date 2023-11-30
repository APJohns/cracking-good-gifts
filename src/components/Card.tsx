import Image from 'next/image'
import { useEffect, useState } from 'react'

import { urlForImage } from '~/lib/sanity.image'
import { type Product } from '~/lib/sanity.queries'
import styles from '~/styles/card.module.css'

export default function Card({ product }: { product: Product }) {

  const [inCart, setInCart] = useState(false);

  const addToCart = () => {
    localStorage.setItem(product._id, JSON.stringify(product));
    setInCart(true);
  }

  useEffect(() => {
    if (localStorage.getItem(product._id)) {
      setInCart(true);
    }
  }, []);

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
          <button onClick={addToCart} disabled={inCart}>
            {inCart ? '✔' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
