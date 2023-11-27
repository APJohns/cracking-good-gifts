import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import category from './category'
import occasion from './occasion'
import product from './product'

export const schemaTypes = [blockContent, product, occasion, category]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, product, occasion, category],
}
