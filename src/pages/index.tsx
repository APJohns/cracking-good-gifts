import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import Link from 'next/link'

import Card from '~/components/Card'
import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getProducts, type Product, productsQuery } from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import { Viaoda_Libre, Inter } from 'next/font/google'

import styles from '~/styles/index.module.css';

const viaoda = Viaoda_Libre({ weight: "400", subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

export const getServerSideProps: GetServerSideProps<
  SharedPageProps & {
    products: Product[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const products = await getProducts(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      products,
    },
  }
}

export default function IndexPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const [products] = useLiveQuery<Product[]>(props.products, productsQuery)
  return (
    <Container>
      <header className={`${styles.hero} ${inter.className}`}>
        <Link href="/" className={`${styles.title} ${viaoda.className}`}>
          <h1>Cracking Good Gifts</h1>
        </Link>
        <p className={styles.tagline}>Crafting a better world<br />One gift at a time</p>
      </header>
      <section className="standard-padding-x">
        <ul className={styles.gallery}>
          {products.length && products.map((post) => (
            <li key={post._id}>
              <Card post={post} />
            </li>
          ))}
        </ul>
      </section>
    </Container>
  )
}
