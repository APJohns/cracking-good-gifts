import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'
import groq from 'groq'
import { type SanityClient } from 'next-sanity'

export const productsQuery = groq`*[_type == "product" && defined(slug.current)] | order(_createdAt desc)`

export async function getProducts(client: SanityClient): Promise<Product[]> {
  return await client.fetch(productsQuery)
}

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0]`

export async function getProduct(
  client: SanityClient,
  slug: string,
): Promise<Product> {
  return await client.fetch(productBySlugQuery, {
    slug,
  })
}

export const productSlugsQuery = groq`
*[_type == "product" && defined(slug.current)][].slug.current
`

/* export interface Product {
  _type: 'product'
  _id: string
  _createdAt: string
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
} */

export interface Product {
  _type: 'product'
  _id: string
  title: string
  slug: Slug
  price: number
  description?: string
  image: ImageAsset
}
