import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Viaoda_Libre } from 'next/font/google'
import Link from 'next/link'
import { useLiveQuery } from 'next-sanity/preview'

import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  categoriesQuery,
  type Category,
  getCategories,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import styles from '~/styles/index.module.css'

const viaoda = Viaoda_Libre({ weight: '400', subsets: ['latin'] })

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

export default function IndexPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const [categories] = useLiveQuery<Category[]>(
    props.categories,
    categoriesQuery,
  )
  return (
    <Container>
      <header className={`${styles.hero}`}>
        <Link href="/" className={`${styles.title} ${viaoda.className}`}>
          <h1>Cracking Good Gifts</h1>
        </Link>
        <p className={styles.tagline}>
          Crafting a better world
          <br />
          One gift at a time
        </p>
      </header>
      <section className={`${styles.categories} standard-padding-x`}>
        <h2>Shop by Category</h2>
        <nav>
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li key={category._id}>
                <Link
                  href={`/products/${category.slug.current}`}
                  className={styles.category}
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </Container>
  )
}
