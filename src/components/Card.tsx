import Image from 'next/image'

import { urlForImage } from '~/lib/sanity.image'
import { type Product } from '~/lib/sanity.queries'
import styles from '~/styles/card.module.css'

export default function Card({ product }: { product: Product }) {
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
      </div>
    </div>
  )
}
