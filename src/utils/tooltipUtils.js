"use strict";
var $ = require("jquery"), utils = require("./baseUtils.js");

/**
 * Write our own tooltip, to avoid loading another library for just this functionality. For now, we only use tooltip for showing parse errors, so this is quite a tailored solution
 * Requirements:
 * 		position tooltip within codemirror frame as much as possible, to avoid z-index issues with external things on page
 * 		use html as content
 */
var grammarTootlip = function(yashe, parent, html) {
  var parent = $(parent);
  var tooltip;
  parent.hover(
    function() {
      if (typeof html == "function") html = html();
      tooltip = $("<div>").addClass("yashe_tooltip").html(html).appendTo(parent);
      repositionTooltip();
    },
    function() {
      $(".yashe_tooltip").remove();
    }
  );

  /**
	 * only need to take into account top and bottom offset for this usecase
	 */
  var repositionTooltip = function() {
    if ($(yashe.getWrapperElement()).offset().top >= tooltip.offset().top) {
      //shit, move the tooltip down. The tooltip now hovers over the top edge of the yashe instance
      tooltip.css("bottom", "auto");
      tooltip.css("top", "26px");
    }
  };
};

/**
 * 
 * WIKIDATA Tooltip
 * 
 */

var triggerTooltip = function( e ) {
  var posX = e.clientX,
  posY = e.clientY + $( window ).scrollTop()

  var token = yashe.getTokenAt( yashe.coordsChar( {
    left: posX,
    top: posY
  } ) ).string;

//Check wikidata prefixes
var possibleEntity = token.split(':')[1]
if(possibleEntity!= undefined){
  checkEntity(possibleEntity).done( function( data ) {
    if(!data.error){
      var entity = data.entities[possibleEntity].labels.en.value +' ('+possibleEntity+')'
      var description = data.entities[possibleEntity].descriptions.en.value
      $( '<div class="CodeMirror cm-s-default CodeMirror-wrap">' ).css( 'position', 'absolute' ).css( 'z-index', '100' )
      .css( 'max-width', '200px' ).css( { 
        top: posY + 2,
        left: posX + 2
      } ).addClass( 'wikibaseRDFtoolTip' ).html("<div class='panel-body'>"+entity+" <br><br>"+description+"</div>").appendTo('body')
    }
  })

  };  

}


var checkEntity = function (entity){
  return $.get(
    {
  
      url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids='+entity,
      dataType: 'jsonp',
  
    })
}


var removeToolTip = function() {
  $( '.wikibaseRDFtoolTip' ).remove();
};


module.exports = {
  grammarTootlip:grammarTootlip,
  triggerTooltip:triggerTooltip,
  removeToolTip:removeToolTip
};