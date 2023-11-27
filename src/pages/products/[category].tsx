import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Inter,Viaoda_Libre } from 'next/font/google'
import Link from 'next/link'
import { useLiveQuery } from 'next-sanity/preview'

import Card from '~/components/Card'
import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getProductsByCategory,
  type Product,
  productsByCategorygQuery,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import styles from '~/styles/index.module.css'

const viaoda = Viaoda_Libre({ weight: '400', subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

export const getServerSideProps: GetServerSideProps<
  SharedPageProps & {
    products: Product[]
  }
> = async ({ draftMode = false, params }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const categoryParam = Array.isArray(params.category)
    ? params.category[0]
    : params.category
  const products = await getProductsByCategory(client, categoryParam)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      products,
    },
  }
}

export default function CategoryPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const [products] = useLiveQuery<Product[]>(
    props.products,
    productsByCategorygQuery,
  )

  return (
    <Container>
      <header className={`${styles.hero} ${inter.className}`}>
        <Link href="/" className={`${styles.title} ${viaoda.className}`}>
          <h1>Cracking Good Gifts</h1>
        </Link>
      </header>
      <section className="standard-padding-x">
        {products.length ? (
          <ul className={styles.gallery}>
            {products.map((product) => (
              <li key={product._id}>
                <Card product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <p>
            We don&apos;t have any products of the type available right now. Please
            check back later, or reach out to us.
          </p>
        )}
      </section>
    </Container>
  )
}
