import unique from 'unique-selector'

import { default as $ } from 'jquery'

export default class ContentEdit {
  static setup(registerChange) {
    $('body')
      .on('click', '*', function(e) {
        $(this).attr('contenteditable', true)
        e.stopPropagation()
        e.preventDefault()
      })
      .on('input', '*', function(e) {
        registerChange('text', {
          selector: unique(this),
          content: $(this).html(),
        })
        e.stopPropagation()
      })
  }

  static act({ selector, content }) {
    $(selector).html(content)
  }
}
