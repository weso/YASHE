"use strict";
var $ = require("jquery"),
    rdfUtils = require('./rdfUtils.js')

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

var triggerTooltip = function( yashe, e) {

  var posX = e.clientX,
  posY = e.clientY + $( window ).scrollTop()

  var token = yashe.getTokenAt( yashe.coordsChar( {
    left: posX,
    top: posY
  } ) ).string;


    
var prefixName = token.split(':')[0]
var wikiElement = token.split(':')[1]

//Check wikidata prefixes
if( rdfUtils.isWikidataValidPrefix(yashe,prefixName) && wikiElement!== undefined  && wikiElement!== ''){

  checkEntity(wikiElement).done( function( data ) {

    if(!data.error){

      var userLang,entity,description,theme
      //Gets the preference languaje from the navigator
      userLang = (navigator.language || navigator.userLanguage).split("-")[0]


      var content = data.entities[wikiElement.toUpperCase()]

      //Check if the property/entity exist
      if(!content.labels)return;

      //Some properties and entities are only avalible in English
      //So if they do not exist we take it in English
      if(content.labels[userLang] && content.descriptions[userLang]){
         
          entity = content.labels[userLang].value +' ('+wikiElement+')'
          description = content.descriptions[userLang].value

      }else{

          entity = content.labels['en'].value +' ('+wikiElement+')'
          description = content.descriptions['en'].value

      }



      if(yashe.getOption('theme') != 'dark')
        theme = {'background':'#fff','color':'#000','border-style':'solid','border-width':'1px','border-color':'#70dbe9','border-radius':'10px','padding':'1px','line-height':'15px','text-align':'center'}
      else
        theme = {'background':'#000','color':'#fff','border-style':'solid','border-width':'1px','border-color':'#70dbe9','border-radius':'10px','padding':'1px','line-height':'15px','text-align':'center'}


      $( '<div class="CodeMirror cm-s-default CodeMirror-wrap">' ).css( 'position', 'absolute' ).css( 'z-index', '100' )
      .css( 'max-width', '200px' ).css( { 
        top: posY + 2,
        left: posX + 2
      } ).addClass( 'wikibaseRDFtoolTip' )
      .html("<div class='wikidata_tooltip'>"+entity+" <br><br>"+description+"</div>")
      .css(theme).css('z-index', 1200)
      .appendTo('body')
    }
  })

  };  

}

//  U S A R         M  É  T  O  D  O    P  Á  R  A  M  S
var checkEntity = function (entity){
  return $.get(
    {
  
      url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids='+entity,
      dataType: 'jsonp',
  
    })
}


var removeWikiToolTip = function() {
  $( '.wikibaseRDFtoolTip' ).remove();
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


module.exports = {
  grammarTootlip:grammarTootlip,
  triggerTooltip:triggerTooltip,
  removeWikiToolTip:removeWikiToolTip,
  debounce:debounce
};