import type {InputProps} from 'sanity'

const UPLOAD_ONLY_TYPES = new Set(['image', 'file'])

export function UploadOnlyAssetInput(props: InputProps) {
  if (!UPLOAD_ONLY_TYPES.has(props.schemaType.name)) {
    return props.renderDefault(props)
  }

  return <div data-dotani-upload-only>{props.renderDefault(props)}</div>
}