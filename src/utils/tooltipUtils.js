"use strict";
var $ = require("jquery"),
    wikiUtils = require('./wikiUtils.js')

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
 * WIKIDATA Tooltip for properties and entities
 * 
 */

var triggerTooltip = function(yashe, e) {

  var posX = e.clientX,
  posY = e.clientY + $( window ).scrollTop()

  var token = yashe.getTokenAt( yashe.coordsChar( {
    left: posX,
    top: posY
  } ) ).string;

  

  var prefixName = token.split(':')[0]
  var wikiElement = token.split(':')[1]

  if(wikiElement!== undefined  && wikiElement!== ''){
    let endpoint = wikiUtils.getEndPoint(yashe,prefixName);
    if(endpoint!=null){
      wikiUtils.getEntity(wikiElement,endpoint)
          .done((data)=>{loadTooltip(yashe,data,wikiElement,posX,posY)})
      .fail(
        ()=>{
          wikiUtils.getEntity(wikiElement,endpoint.replace('/w/','/wiki/'))
            .done((data)=>{loadTooltip(yashe,data,wikiElement,posX,posY)})
        });  
    }
  }

}

var loadTooltip = function(yashe,data,wikiElement,posX,posY){
    var entityData  = wikiUtils.getEntityData(wikiElement,data);
    if(entityData && entityData.title!=''){
      let theme = yashe.getOption('theme');
      let cssStyle = themeStyles['default'];
      if(theme=='dark'){
        cssStyle = themeStyles['dark'];
      }

      //Jquery in 2020 coooool
      $( '<div class="CodeMirror cm-s-default CodeMirror-wrap">' )
        .css( 'position', 'absolute' )
        .css( 'z-index', '1200' )
        .css( 'max-width', '200px' ).css( { 
        top: posY + 2,
        left: posX + 2
        } )
        .addClass('wikidataTooltip').css('height','auto')
        .append(
          $('<div class="wikidata_tooltip">').css(cssStyle)
          .append(
            $('<div>').html(entityData.title).css(styles.title))
          .append(
            $('<div>').html(entityData.description).css(styles.description)))
        .appendTo('body').fadeIn( 'slow' );
    }
    
}


var removeWikiToolTip = function() {
  $( '.wikidataTooltip' ).remove();
};


/**
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. If `immediate` is passed, trigger the function on the
   * leading edge, instead of the trailing.
   *
   * More info: https://davidwalsh.name/javascript-debounce-function
   *
 * @param {funciton} func Function to be executed
 * @param {int} wait Time to wait
 * @param {boolean} immediate
 * @return {object} resutl
 */
const debounce = function(func, wait, immediate) {
  let timeout; let result;
  return function() {
    const context = this; 
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
};




//I'm not able to make this works in the scss...
const styles ={
  title:{
    'text-align': 'left',
    'font-size':17,
    'font-family': 'Arial, Helvetica, sans-serif'
  },
  description:{
    'display': 'inline-block',
    'line-height': '23px',
    'text-align': 'left',
    'margin-top': '3px',
    'font-size':14,
    'font-family': 'Arial, Helvetica, sans-serif'
  }   
}

const themeStyles ={
  default:{
    'display': 'inline-block',
    'justify-content': 'center',
    'padding': '10px',
    'border-radius': '8px',
    'border': '1px solid #B8F5F3',
    'background':'white',
    'color':'#222',
    'z-index':'1200'
  },
  dark:{
    'display': 'inline-block',
    'justify-content': 'center',
    'padding': '5px',
    'border-radius': '10px',
    'border': '1px solid #70dbe9',
    'background':'#222',
    'color':'white',
    'z-index':'1200'
  }
}



module.exports = {
  grammarTootlip:grammarTootlip,
  triggerTooltip:triggerTooltip,
  removeWikiToolTip:removeWikiToolTip,
  debounce:debounce,
};