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

var triggerTooltip = function( e ) {
  var posX = e.clientX,
  posY = e.clientY + $( window ).scrollTop()

  var token = yashe.getTokenAt( yashe.coordsChar( {
    left: posX,
    top: posY
  } ) ).string;


//Check wikidata prefixes
var prefixName = token.split(':')[0],
possibleEntity = token.split(':')[1]


if( isWikidataValidPrefix(prefixName) && possibleEntity!== undefined  && possibleEntity!== ''){

  checkEntity(possibleEntity).done( function( data ) {

    if(!data.error){

      var userLang,entity,description,theme
      //Gets the preference languaje from the navigator
      userLang = (navigator.language || navigator.userLanguage).split("-")[0]

      var content = data.entities[possibleEntity]
      //Some properties and entities are only avalible in English
      //So if they do not exist we take it in English
      if(content.labels[userLang] && content.descriptions[userLang]){
         
          entity = content.labels[userLang].value +' ('+possibleEntity+')'
          description = content.descriptions[userLang].value

      }else{

          entity = content.labels['en'].value +' ('+possibleEntity+')'
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
      .css(theme)
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


var removeToolTip = function() {
  $( '.wikibaseRDFtoolTip' ).remove();
};


var isWikidataValidPrefix = function(prefixName){

    var definedPrefixex = yashe.getDefinedPrefixes()
    var iriPrefix
    
    //Gets de IRI of the prefix from the defined
    for (const prop in definedPrefixex) {
      if(prop === prefixName)
        iriPrefix = definedPrefixex[prop]
    }

    
    //Compare iriPrefix with the valid wikidata prefixes
    var wikiPrefixes = rdfUtils.validTootlipPrefixes
    for(const pref in wikiPrefixes){
      if(wikiPrefixes[pref] === iriPrefix)
        return true
    }
    return false
}


module.exports = {
  grammarTootlip:grammarTootlip,
  triggerTooltip:triggerTooltip,
  removeToolTip:removeToolTip,
  isWikidataValidPrefix:isWikidataValidPrefix
};