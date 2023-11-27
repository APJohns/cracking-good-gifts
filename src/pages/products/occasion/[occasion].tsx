import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Inter, Viaoda_Libre } from 'next/font/google'
import Link from 'next/link'
import { useLiveQuery } from 'next-sanity/preview'

import Container from '~/components/Container'
import ProductList from '~/components/ProductList'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getProductsByOccasion,
  type Product,
  productsByOccasionQuery,
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
  const occasionParam = Array.isArray(params.occasion)
    ? params.occasion[0]
    : params.occasion
  const products = await getProductsByOccasion(client, occasionParam)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      products,
    },
  }
}

export default function OccasionPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const [products] = useLiveQuery<Product[]>(
    props.products,
    productsByOccasionQuery,
  )

  return (
    <Container>
      <header className={`${styles.hero} ${inter.className}`}>
        <Link href="/" className={`${styles.title} ${viaoda.className}`}>
          <h1>Cracking Good Gifts</h1>
        </Link>
      </header>
      <section className="standard-padding-x">
        <ProductList products={products} />
      </section>
    </Container>
  )
}
