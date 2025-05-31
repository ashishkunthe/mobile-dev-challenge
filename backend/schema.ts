import { graphql, list } from '@keystone-6/core';
import {
  text,
  integer,
  select,
  relationship,
  timestamp,
} from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';
import { BaseItem } from '@keystone-6/core/types';

export const lists = {
  InstantNoodle: list({
    access: allowAll,

    hooks: {
      async resolveInput({ resolvedData, item, operation }) {
        if (
          operation === 'update' &&
          resolvedData.reviewsCount !== undefined &&
          item?.reviewsCount !== undefined
        ) {
          const oldCount = item.reviewsCount;
          const newCount = resolvedData.reviewsCount;

          if (newCount < oldCount) {
            throw new Error('reviewsCount cannot be decreased');
          }

          if (newCount > oldCount) {
            resolvedData.lastReviewedAt = new Date().toISOString();
          }
        }
        return resolvedData;
      },
    },

    fields: {
      name: text({ validation: { isRequired: true } }),

      brand: text({ validation: { isRequired: true } }),

      spicinessLevel: integer({
        validation: { isRequired: true, min: 1, max: 5 },
        defaultValue: 3,
        ui: { description: 'Scale of 1 (mild) to 5 (🔥)' },
      }),

      originCountry: select({
        type: 'enum',
        options: [
          { label: 'South Korea', value: 'south_korea' },
          { label: 'Indonesia', value: 'indonesia' },
          { label: 'Malaysia', value: 'malaysia' },
          { label: 'Thailand', value: 'thailand' },
          { label: 'Japan', value: 'japan' },
          { label: 'Singapore', value: 'singapore' },
          { label: 'Vietnam', value: 'vietnam' },
          { label: 'China', value: 'china' },
          { label: 'Taiwan', value: 'taiwan' },
          { label: 'Philippines', value: 'philippines' },
        ],
        validation: { isRequired: true },
      }),

      rating: integer({
        validation: { isRequired: true, min: 1, max: 10 },
        defaultValue: 5,
        ui: { description: 'Your personal rating (1–10)' },
      }),

      imageURL: text({
        validation: { isRequired: false },
        ui: { description: 'URL to the noodle image' },
      }),

      category: relationship({
        ref: 'Category.noodles',
        many: false,
        ui: { displayMode: 'select' },
      }),

      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),

      lastReviewedAt: timestamp(),

      reviewsCount: integer({
        defaultValue: 0,
        validation: { isRequired: true },
      }),

      spicinessDescription: graphql.field({
        type: graphql.String,
        resolve(item: BaseItem) {
          const level = (item as any).spicinessLevel as number;
          if (level === 1 || level === 2) return 'Mild';
          if (level === 3 || level === 4) return 'Medium';
          if (level === 5) return 'Hot';
          return null;
        },
      }),
    },
  }),

  Category: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),

      noodles: relationship({ ref: 'InstantNoodle.category', many: true }),

      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
};
