import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useLiveQuery } from 'next-sanity/preview'
import { ChangeEvent, useEffect, useState } from 'react'

import Container from '~/components/Container'
import ProductList from '~/components/ProductList'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  byTypeAndSlugQuery,
  type Category,
  getByTypeAndSlug,
  getOccasions,
  getProductsByCategory,
  getProductsByFilters,
  type Occasion,
  occasionsQuery,
  type Product,
  productsByCategoryQuery,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'

export const getServerSideProps: GetServerSideProps<
  SharedPageProps & {
    products: Product[]
    occasions: Occasion[]
    category: Category
  }
> = async ({ draftMode = false, params }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const categoryParam = Array.isArray(params.category)
    ? params.category[0]
    : params.category
  const products = await getProductsByCategory(client, categoryParam)
  const occasions = await getOccasions(client)
  const category = await getByTypeAndSlug(client, 'category', categoryParam)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      products,
      occasions,
      category,
    },
  }
}

export default function CategoryPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const [products] = useLiveQuery<Product[]>(
    props.products,
    productsByCategoryQuery,
  )
  const [occasions] = useLiveQuery<Occasion[]>(props.occasions, occasionsQuery)

  const [category] = useLiveQuery<Category>(props.category, byTypeAndSlugQuery)

  const router = useRouter()

  const [filters, setFilters] = useState<Set<string>>(new Set())
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  const filterHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const appliedFilters = new Set(filters)
    if (e.target.checked) {
      appliedFilters.add(e.target.value)
    } else {
      appliedFilters.delete(e.target.value)
    }
    setFilters(appliedFilters)
  }

  useEffect(() => {
    const client = getClient(
      props.draftMode ? { token: props.token } : undefined,
    )
    const category = Array.isArray(router.query.category)
      ? router.query.category[0]
      : router.query.category

    if (Array.from(filters).length === 0) {
      setFilteredProducts(products)
    } else {
      getProductsByFilters(client, [category], Array.from(filters)).then(
        (prods) => {
          setFilteredProducts(prods)
        },
      )
    }
  }, [filters, products, props.draftMode, props.token, router.query.category])

  return (
    <Container hasTagline={false} heading={category.title}>
      <section className="standard-padding-x product-page-layout">
        <fieldset className="filters">
          <legend>Occasions</legend>
          {occasions.map((occasion) => (
            <label key={occasion._id} className="filter">
              <input
                type="checkbox"
                value={occasion.slug.current}
                onChange={filterHandler}
              />
              <span>{occasion.title}</span>
            </label>
          ))}
        </fieldset>
        <ProductList products={filteredProducts} />
      </section>
    </Container>
  )
}
