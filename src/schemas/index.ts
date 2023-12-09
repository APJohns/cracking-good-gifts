import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import category from './category'
import occasion from './occasion'
import product from './product'
import homepage from './homepage'

export const schemaTypes = [blockContent, product, occasion, category, homepage]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, product, occasion, category, homepage],
}
