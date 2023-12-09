import { Category, Product } from '~/lib/sanity.queries'
import styles from '~/styles/productList.module.css'

import Card from './Card'

interface Props {
  products: Product[]
  getCategoryOfProduct: (product: Product) => Category
}

export default function ProductList({ products, getCategoryOfProduct }: Props) {
  if (products.length) {
    return (
      <ul className={styles.gallery}>
        {products.map((product) => (
          <li key={product._id}>
            <Card
              product={product}
              getCategoryOfProduct={getCategoryOfProduct}
            />
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
