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

var definedPrefixex = yashe.getDefinedPrefixes();
var endpoint = yashe.options.endpoint;
    
Object.keys(definedPrefixex).map(p =>{
  if(p==prefixName){
    endpoint = definedPrefixex[p].split('/wiki/')[0]+'/w/'; 
  }
})

//Check wikidata prefixes
//if( rdfUtils.isWikidataValidPrefix(yashe,prefixName) && wikiElement!== undefined  && wikiElement!== ''){

  checkEntity(wikiElement,endpoint)
      .done((data)=>{loadTooltip(data,wikiElement,posX,posY)})
  .fail(
    ()=>{checkEntity(wikiElement,endpoint.replace('/w/','/wiki/'))
      .done((data)=>{loadTooltip(data,wikiElement,posX,posY)})
    }); 

}

var loadTooltip = function(data,wikiElement,posX,posY){
  if(!data.error){

      var userLang;
      var entity = '';
      var description=''
      var theme;
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

          let lb = content.labels['en'];
          let desc = content.descriptions['en'];
          if(lb){
            entity = lb.value +' ('+wikiElement+')';
          }
          if(desc){
             description = desc.value
          }
          
         

      }

      theme = yashe.getOption('theme');
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
          $('<div class="wikidata_tooltip">').css(themeStyles[theme])
          .append(
            $('<div>').html(entity).css(styles.title))
          .append(
            $('<div>').html(description).css(styles.description)))
        .appendTo('body').fadeIn( 'slow' );
    }
}

//  U S A R         M  É  T  O  D  O    P  Á  R  A  M  S
var checkEntity = function (entity,endPoint){
/*   let endpoint = 'https://www.wikidata.org/w/';//default
  let customEndpoint = document.getElementById("endPoint").textContent;;
  console.log(customEndpoint)
  if(customEndpoint.lenth>0){
    endpoint= $('#endPoint').val();
  }
  console.log(endPoint) */
  return $.get(
    {
  
      url: endPoint+'api.php?action=wbgetentities&format=json&ids='+entity,
      dataType: 'jsonp',
  
    })
     
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
  wiki:{
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
  debounce:debounce
};