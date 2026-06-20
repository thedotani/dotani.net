/**
 * Shared fieldset layout tokens — keep in sync with studio-ui.css variables.
 *
 * Sanity renders fieldsets as:
 *   fieldset[data-testid="fieldset-{name}"] > … > [data-ui="Grid"] (ColumnarGrid)
 *
 * Column templates are set in CSS via those fieldset test ids.
 */

/** Fieldset with slug + order + icon (service overviewMeta) */
export const slugOrderIconFieldset = {
  name: 'overviewMeta',
  title: ' ',
  options: {columns: 3},
} as const

/** Fieldset with year + client + role (portfolio clientRow) */
export const yearClientRoleFieldset = {
  name: 'clientRow',
  title: ' ',
  options: {columns: 3},
} as const

/** Fieldset with industry + order + accent colour (portfolio tagsRow) */
export const industryOrderAccentFieldset = {
  name: 'tagsRow',
  title: ' ',
  options: {columns: 3},
} as const

/** Brand logos — single row (Main · Mobile · Footer · Favicon) */
export const logoRowFieldset = {
  name: 'logoRow',
  title: ' ',
  options: {columns: 4},
} as const