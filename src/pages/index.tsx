import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Viaoda_Libre } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useLiveQuery } from 'next-sanity/preview'

import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { urlForImage } from '~/lib/sanity.image'
import {
  categoriesQuery,
  type Category,
  getCategories,
  getHomepage,
  getOccasions,
  type Homepage,
  homepageQuery,
  type Occasion,
  occasionsQuery,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import styles from '~/styles/index.module.css'

const viaoda = Viaoda_Libre({ weight: '400', subsets: ['latin'] })

export const getServerSideProps: GetServerSideProps<
  SharedPageProps & {
    categories: Category[]
    occasions: Occasion[]
    homepage: Homepage
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const categories = await getCategories(client)
  const occasions = await getOccasions(client)
  const homepage = await getHomepage(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      categories,
      occasions,
      homepage,
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
  const [occasions] = useLiveQuery<Occasion[]>(props.occasions, occasionsQuery)
  const [homepage] = useLiveQuery<Homepage>(props.homepage, homepageQuery)

  return (
    <Container>
      <header className="hero">
        <div className="hero-content">
          <h1 className={viaoda.className}>Cracking Good Gifts</h1>
          <p className="tagline">
            Crafting a better world
            <br />
            One gift at a time
          </p>
        </div>
      </header>
      <section className={styles.donate}>
        <div className={styles.donateBlurb}>
          <h2>Help Us Reach Our Goal</h2>
          <p>All proceeds go to Dana-Farber Cancer Institute. Help us reach our goal!</p>
        </div>
        <div className={styles.donateBtn}>
          <Link href="https://jimmyfund.app.link/e/I0ZeMV3LZJb" target="_blank" className={styles.cta}>Make a Donation</Link>
        </div>
      </section>
      {homepage && (
        <section className={`${styles.aboutUs} standard-padding-x`}>
          <h2>{homepage.title}</h2>
          <div className={styles.aboutUsBlurb}>
            <Image
              src={urlForImage(homepage.image).width(300).height(300).url()}
              height={300}
              width={300}
              alt={homepage.alt}
            />
            <p>{homepage.blurb}</p>
          </div>
        </section>
      )}
      <section className={`${styles.categories} standard-padding-x`}>
        <h2>Shop by Category</h2>
        <nav>
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li key={category._id}>
                <Link
                  href={`/products/category/${category.slug.current}`}
                  className={styles.category}
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section className={`${styles.categories} standard-padding-x`}>
        <h2>Shop by Occasion</h2>
        <nav>
          <ul className={styles.categoryList}>
            {occasions.map((occasion) => (
              <li key={occasion._id}>
                <Link
                  href={`/products/occasion/${occasion.slug.current}`}
                  className={styles.category}
                >
                  {occasion.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </Container>
  )
}
