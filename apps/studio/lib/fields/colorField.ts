import {defineField, type FieldDefinition} from 'sanity'
import {HexColorInput} from '../components/HexColorInput'

type ColorFieldOptions = {
  title: string
  name: string
  group?: string
  fieldset?: string
  initialValue?: string
  required?: boolean
  hidden?: FieldDefinition['hidden']
}

export function colorField({
  title,
  name,
  group,
  fieldset,
  initialValue,
  required,
  hidden,
}: ColorFieldOptions): FieldDefinition {
  return defineField({
    name,
    title,
    type: 'string',
    group,
    fieldset,
    initialValue,
    hidden,
    components: {
      input: HexColorInput,
    },
    validation: required ? (rule) => rule.required() : undefined,
  })
}