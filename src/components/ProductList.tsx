import { Product } from '~/lib/sanity.queries'
import styles from '~/styles/productList.module.css'

import Card from './Card'

export default function ProductList({ products }: { products: Product[] }) {
  if (products.length) {
    return (
      <ul className={styles.gallery}>
        {products.map((product) => (
          <li key={product._id}>
            <Card product={product} />
          </li>
        ))}
      </ul>
    )
  } else {
    return (
      <p className={`${styles.nonFound} standard-padding-x`}>
        We don&apos;t have any products of the type available right now. Please
        check back later, or reach out to us.
      </p>
    )
  }
}
