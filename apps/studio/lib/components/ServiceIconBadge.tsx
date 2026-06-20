import {Box, Text} from '@sanity/ui'

const ICON_LABELS: Record<string, string> = {
  'social-media': 'SM',
  'personal-brand': 'PB',
  'content-strategy': 'CS',
  'web-design': 'WD',
  campaign: 'DC',
  training: 'TW',
  strategy: 'ST',
  analytics: 'AN',
  consulting: 'CO',
}

type Props = {
  icon?: string
}

export function ServiceIconBadge({icon}: Props) {
  const label = icon ? ICON_LABELS[icon] || icon.slice(0, 2).toUpperCase() : '?'

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        background: 'color-mix(in srgb, #3b82f6 18%, transparent)',
        border: '1px solid color-mix(in srgb, #3b82f6 35%, transparent)',
      }}
    >
      <Text size={1} weight="semibold">
        {label}
      </Text>
    </Box>
  )
}