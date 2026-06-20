import {defineField, type FieldDefinition} from 'sanity'

type FeaturedFieldOptions = {
  group?: string
  fieldset?: string
}

export function featuredField({group, fieldset}: FeaturedFieldOptions = {}): FieldDefinition {
  return defineField({
    name: 'featured',
    title: 'Featured',
    type: 'boolean',
    group,
    fieldset,
    initialValue: false,
  })
}