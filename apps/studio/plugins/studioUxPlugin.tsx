import {definePlugin} from 'sanity'
import {UploadOnlyAssetInput} from '../lib/components/UploadOnlyAssetInput'
import {PaneResizeManager} from './PaneResizeManager'

export const studioUxPlugin = definePlugin({
  name: 'dotani-studio-ux',
  form: {
    components: {
      input: UploadOnlyAssetInput,
    },
  },
  studio: {
    components: {
      layout: (props) => {
        const DefaultLayout = props.renderDefault(props)
        return (
          <>
            <PaneResizeManager />
            {DefaultLayout}
          </>
        )
      },
    },
  },
})