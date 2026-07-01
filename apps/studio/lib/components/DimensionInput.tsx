import {useCallback} from 'react'
import {set, unset, type ObjectInputProps} from 'sanity'
import {Box, Flex, Select, TextInput} from '@sanity/ui'

const UNITS = [
  {value: 'px', title: 'px'},
  {value: 'rem', title: 'rem'},
  {value: 'em', title: 'em'},
  {value: '%', title: '%'},
  {value: 'vw', title: 'vw'},
]

type DimensionValue = {
  value?: number
  unit?: string
}

export function DimensionInput(props: ObjectInputProps<DimensionValue>) {
  const {value, onChange, readOnly} = props
  const currentValue = value?.value
  const currentUnit = value?.unit || 'rem'

  const patch = useCallback(
    (next: DimensionValue | undefined) => {
      if (!next || (next.value == null && !next.unit)) {
        onChange(unset())
        return
      }
      onChange(set(next))
    },
    [onChange],
  )

  return (
    <Flex data-dotani-dimension-input align="center" gap={1}>
      <Box flex={1}>
        <TextInput
          type="number"
          value={currentValue ?? ''}
          readOnly={readOnly}
          onChange={(event) => {
            const parsed = event.currentTarget.value
            patch({
              value: parsed === '' ? undefined : Number(parsed),
              unit: currentUnit,
            })
          }}
        />
      </Box>
      <Box flex="none" style={{width: '4.5rem'}}>
        <Select
          fontSize={1}
          value={currentUnit}
          readOnly={readOnly}
          onChange={(event) => {
            patch({
              value: value?.value,
              unit: event.currentTarget.value,
            })
          }}
        >
          {UNITS.map((unit) => (
            <option key={unit.value} value={unit.value}>
              {unit.title}
            </option>
          ))}
        </Select>
      </Box>
    </Flex>
  )
}