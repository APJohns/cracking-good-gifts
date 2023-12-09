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

export const productsByCategoryQuery = groq`*[_type == "product" && category->slug.current == $category]`

export async function getProductsByCategory(
  client: SanityClient,
  category: string,
): Promise<Product[]> {
  return await client.fetch(productsByCategoryQuery, {
    category,
  })
}

export const productsByOccasionQuery = groq`*[_type == "product" && occasion->slug.current == $occasion]`

export async function getProductsByOccasion(
  client: SanityClient,
  occasion: string,
): Promise<Product[]> {
  return await client.fetch(productsByOccasionQuery, {
    occasion,
  })
}

export const productsByFiltersQuery = groq`*[_type == "product" && occasion->slug.current in $occasions && category->slug.current in $categories]`

export async function getProductsByFilters(
  client: SanityClient,
  categories: string[],
  occasions: string[],
): Promise<Product[]> {
  return await client.fetch(productsByFiltersQuery, {
    categories,
    occasions,
  })
}

export const productSlugsQuery = groq`
*[_type == "product" && defined(slug.current)][].slug.current
`

interface Reference {
  _ref: string
  _type: 'reference'
}

export interface Product {
  _type: 'product'
  _id: string
  title: string
  slug: Slug
  price: number
  description?: string
  image: ImageAsset
  category: Reference
  occasion: Reference
}

// Category

export interface Category {
  _type: 'category'
  _id: string
  title: string
  slug: Slug
}

export const categoriesQuery = groq`*[_type == "category" && defined(slug.current)]`

export async function getCategories(client: SanityClient): Promise<Category[]> {
  return await client.fetch(categoriesQuery)
}

export const categoryByIdQuery = groq`*[_type == "category" && category._id == $categoryId]`

export async function getCategoryById(
  client: SanityClient,
  categoryId: string,
): Promise<Category> {
  return await client.fetch(categoryByIdQuery, { categoryId })
}

// Occasion

export interface Occasion {
  _type: 'category'
  _id: string
  title: string
  slug: Slug
}

export const occasionsQuery = groq`*[_type == "occasion" && defined(slug.current)]`

export async function getOccasions(client: SanityClient): Promise<Occasion[]> {
  return await client.fetch(occasionsQuery)
}

export const byTypeAndSlugQuery = groq`*[_type == $type && slug.current == $slug][0]`

export async function getByTypeAndSlug(
  client: SanityClient,
  type: string,
  slug: string,
): Promise<any> {
  return await client.fetch(byTypeAndSlugQuery, {
    type,
    slug,
  })
}

// Homepage

export interface Homepage {
  title: string
  blurb: string
  image: ImageAsset
  alt: string
}

export const homepageQuery = groq`*[_type == "homepage"][0]`

export async function getHomepage(
  client: SanityClient
): Promise<Homepage> {
  return await client.fetch(homepageQuery)
}