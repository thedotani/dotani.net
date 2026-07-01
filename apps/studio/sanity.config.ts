import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {studioTheme} from './theme/studioTheme'
import {studioUxPlugin} from './plugins/studioUxPlugin'
import './styles/pane-behavior.css'
import './styles/studio-ui.css'

export default defineConfig({
  name: 'default',
  title: 'Dotani Studio',

  projectId: 'tmw5kvr6',
  dataset: 'staging',

  theme: studioTheme,

  plugins: [
    studioUxPlugin(),
    colorInput(),
    structureTool({structure}),
    ...(process.env.NODE_ENV === 'production' ? [] : [visionTool({defaultApiVersion: '2024-01-01'})]),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((template) => template.templateId !== 'siteSettings')
      }
      return prev
    },
  },
})