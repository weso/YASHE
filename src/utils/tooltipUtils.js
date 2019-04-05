'use strict'
var $ = require('jquery')

/**
 * Write our own tooltip, to avoid loading another library for just this functionality. For now, we only use tooltip for showing parse errors, so this is quite a tailored solution
 * Requirements:
 * position tooltip within codemirror frame as much as possible, to avoid z-index issues with external things on page
 * use html as content
 */
module.exports = function (yashe, parent, html) {
  var actualParent = $(parent)
  var tooltip
  actualParent.hover(
    function () {
      if (typeof html === 'function') html = html()
      tooltip = $('<div>').addClass('yashe_tooltip').html(html).appendTo(actualParent)
      repositionTooltip()
    },
    function () {
      $('.yashe_tooltip').remove()
    }
  )

  /**
   * only need to take into account top and bottom offset for this usecase
   */
  var repositionTooltip = function () {
    if ($(yashe.getWrapperElement()).offset().top >= tooltip.offset().top) {
      // shit, move the tooltip down. The tooltip now hovers over the top edge of the yashe instance
      tooltip.css('bottom', 'auto')
      tooltip.css('top', '26px')
    }
  }
}
