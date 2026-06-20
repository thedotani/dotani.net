import {defineField} from 'sanity'
import {DimensionInput} from '../components/DimensionInput'

export function dimensionField(title: string, name: string, defaultValue = 0) {
  return defineField({
    name,
    title,
    type: 'object',
    components: {
      input: DimensionInput,
    },
    fields: [
      defineField({
        name: 'value',
        title: 'Value',
        type: 'number',
        validation: (rule) => rule.min(0),
        initialValue: defaultValue,
      }),
      defineField({
        name: 'unit',
        title: 'Unit',
        type: 'string',
        initialValue: 'rem',
      }),
    ],
  })
}