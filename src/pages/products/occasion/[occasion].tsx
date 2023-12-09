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
  categoriesQuery,
  type Category,
  getByTypeAndSlug,
  getCategories,
  getProductsByFilters,
  getProductsByOccasion,
  type Occasion,
  type Product,
  productsByOccasionQuery,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'

export const getServerSideProps: GetServerSideProps<
  SharedPageProps & {
    products: Product[]
    categories: Category[]
    occasion: Occasion
  }
> = async ({ draftMode = false, params }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const occasionParam = Array.isArray(params.occasion)
    ? params.occasion[0]
    : params.occasion
  const products = await getProductsByOccasion(client, occasionParam)
  const categories = await getCategories(client)
  const occasion = await getByTypeAndSlug(client, 'occasion', occasionParam)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      products,
      categories,
      occasion,
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

  const [categories] = useLiveQuery<Category[]>(
    props.categories,
    categoriesQuery,
  )

  const [occasion] = useLiveQuery<Occasion>(props.occasion, byTypeAndSlugQuery)

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

  const getCategoryOfProduct = (product: Product): Category => {
    return categories.find((category) => category._id === product.category._ref)
  }

  useEffect(() => {
    const client = getClient(
      props.draftMode ? { token: props.token } : undefined,
    )
    const occasion = Array.isArray(router.query.occasion)
      ? router.query.occasion[0]
      : router.query.occasion

    if (Array.from(filters).length === 0) {
      setFilteredProducts(products)
    } else {
      getProductsByFilters(client, Array.from(filters), [occasion]).then(
        (prods) => {
          setFilteredProducts(prods)
        },
      )
    }
  }, [filters, products, props.draftMode, props.token, router.query.occasion])

  return (
    <Container>
      <h1 className="page-heading standard-padding-x">{occasion.title}</h1>
      <section className="standard-padding-x product-page-layout">
        <fieldset className="filters">
          <legend>Categories</legend>
          {categories.map((category) => (
            <label key={occasion._id} className="filter">
              <input
                type="checkbox"
                value={category.slug.current}
                onChange={filterHandler}
              />
              <span>{category.title}</span>
            </label>
          ))}
        </fieldset>
        <ProductList
          products={filteredProducts}
          getCategoryOfProduct={getCategoryOfProduct}
        />
      </section>
    </Container>
  )
}
