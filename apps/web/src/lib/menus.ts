export type MenuPlacement =
  | 'header'
  | 'mobileMenu'
  | 'mobileMenuFooter'
  | 'footerCol2'
  | 'footerCol3'
  | 'footerCol4'
  | 'footerCopyright'

export type UniversalMenuItem = {
  label: string
  url: string
  showIn?: Partial<Record<MenuPlacement, boolean>>
}

export type LegacyMenuItem = {
  label: string
  url: string
}

export function getMenuItems(
  items: UniversalMenuItem[] | undefined,
  placement: MenuPlacement,
): Array<{label: string; url: string}> {
  return (items || [])
    .filter((item) => item?.label && item?.url && item.showIn?.[placement])
    .map(({label, url}) => ({label, url}))
}

/** Fallback for documents not yet migrated to universal menus. */
export function resolveMenuItems(
  universalItems: UniversalMenuItem[] | undefined,
  legacyItems: LegacyMenuItem[] | undefined,
  placement: MenuPlacement,
): Array<{label: string; url: string}> {
  const fromUniversal = getMenuItems(universalItems, placement)
  if (fromUniversal.length > 0 || (universalItems && universalItems.length > 0)) {
    return fromUniversal
  }

  if (!legacyItems?.length) return []

  if (placement === 'header' || placement === 'mobileMenu') {
    return legacyItems.map(({label, url}) => ({label, url}))
  }

  return []
}