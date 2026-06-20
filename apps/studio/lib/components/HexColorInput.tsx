import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {set, unset, type StringInputProps} from 'sanity'
import {Box, Card, Flex, TextInput} from '@sanity/ui'
import {ChromePicker, type ColorResult} from 'react-color'

const PICKER_HEIGHT = 340

function normalizeHex(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'hex' in value) {
    return (value as {hex?: string}).hex || ''
  }
  return ''
}

export function HexColorInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props
  const hex = normalizeHex(value)
  const [open, setOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const commit = useCallback(
    (next: string) => {
      const trimmed = next.trim()
      if (!trimmed) {
        onChange(unset())
        return
      }
      onChange(set(trimmed.startsWith('#') ? trimmed : `#${trimmed}`))
    },
    [onChange],
  )

  const handlePickerChange = useCallback(
    (color: ColorResult) => {
      commit(color.hex)
    },
    [commit],
  )

  const handlePickerComplete = useCallback(
    (color: ColorResult) => {
      commit(color.hex)
      setOpen(false)
    },
    [commit],
  )

  const close = useCallback(() => setOpen(false), [])

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return

    const rect = rootRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    setOpenUp(spaceBelow < PICKER_HEIGHT && spaceAbove > spaceBelow)
  }, [open])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const swatchStyle = useMemo(
    () => ({
      width: 28,
      height: 28,
      borderRadius: 6,
      backgroundColor: hex || 'var(--card-muted-fg-color)',
      border: '1px solid var(--card-border-color)',
      cursor: readOnly ? 'default' : 'pointer',
      flexShrink: 0,
    }),
    [hex, readOnly],
  )

  return (
    <Flex ref={rootRef} align="center" gap={2} style={{position: 'relative'}}>
      <button
        type="button"
        style={swatchStyle}
        onClick={() => !readOnly && setOpen((prev) => !prev)}
        aria-label="Pick colour"
        aria-expanded={open}
        disabled={readOnly}
      />
      <Box flex={1}>
        <TextInput
          value={hex}
          readOnly={readOnly}
          onChange={(event) => commit(event.currentTarget.value)}
          placeholder="#000000"
        />
      </Box>
      {open && !readOnly && (
        <Card
          padding={2}
          radius={2}
          shadow={3}
          style={{
            position: 'absolute',
            left: 0,
            zIndex: 20,
            ...(openUp
              ? {bottom: 'calc(100% + 0.35rem)'}
              : {top: 'calc(100% + 0.35rem)'}),
          }}
        >
          <ChromePicker
            color={hex || '#000000'}
            onChange={handlePickerChange}
            onChangeComplete={handlePickerComplete}
            disableAlpha
          />
          <button
            type="button"
            onClick={close}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              border: '1px solid var(--card-border-color)',
              borderRadius: 6,
              background: 'transparent',
              color: 'var(--card-fg-color)',
              padding: '0.35rem 0.5rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            Done
          </button>
        </Card>
      )}
    </Flex>
  )
}