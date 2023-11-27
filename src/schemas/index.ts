import { SchemaTypeDefinition } from 'sanity';

import blockContent from './blockContent';
import product from './product';
import occasion from './occasion';
import productType from './productType';

export const schemaTypes = [blockContent, product, occasion, productType];
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, product, occasion, productType],
};
