import Quill from 'quill'
import { icon } from './string'

export function initQuillIcons() {
  const icons = Quill.import('ui/icons') as any

  icons['bold'] = icon('bold')
  icons['italic'] = icon('italic')
  icons['underline'] = icon('underline')
  icons['strike'] = icon('strikethrough')

  icons['list']['ordered'] = icon('list-numbers')
  icons['list']['bullet'] = icon('list')

  icons['indent'] = icon('indent-increase')
  icons['outdent'] = icon('indent-decrease')

  icons['link'] = icon('link')
  icons['image'] = icon('photo')
  icons['video'] = icon('video')

  icons['code-block'] = icon('code')
  icons['clean'] = icon('trash')

  icons['color'] = icon('paint')
  icons['background'] = icon('background')

  icons['script']['super'] = icon('superscript')
  icons['script']['sub'] = icon('subscript')

  icons['blockquote'] = icon('blockquote')

  icons['align'][''] = icon('align-left')
  icons['align']['center'] = icon('align-center')
  icons['align']['right'] = icon('align-right')
  icons['align']['justify'] = icon('align-justified')

  icons['header']['1'] = icon('h-1')
  icons['header']['2'] = icon('h-2')
  icons['header']['3'] = icon('h-3')
  icons['header'][''] = icon('letter-t')
}
