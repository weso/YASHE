"use strict";
//make sure any console statements
window.console = window.console || {
  log: function() {}
};

/**
 * Load libraries
 */
var $ = require("jquery"),
  CodeMirror = require("codemirror"),
  utils = require("./utils/baseUtils.js"),
  yutils = require("yasgui-utils");

require("../lib/deparam.js");
require("codemirror/addon/fold/foldcode.js");
require("codemirror/addon/fold/foldgutter.js");
require("codemirror/addon/fold/xml-fold.js");
require("codemirror/addon/fold/brace-fold.js");
require("./prefixes/prefixFold.js");
require("codemirror/addon/hint/show-hint.js");
require("codemirror/addon/search/searchcursor.js");
require("codemirror/addon/edit/matchbrackets.js");
require("codemirror/addon/runmode/runmode.js");
require("codemirror/addon/display/fullscreen.js");
require("../lib/grammar/tokenizer.js");

/**
 * Main YASHE constructor. Pass a DOM element as argument to append the editor to, and (optionally) pass along config settings (see the YASHE.defaults object below, as well as the regular CodeMirror documentation, for more information on configurability)
 *
 * @constructor
 * @param {DOM-Element} parent element to append editor to.
 * @param {object} settings
 * @param {boolean} activateStore Set whether the shape will be store or not
 * @class YASHE
 * @return {doc} YASHE document
 */
var root = (module.exports = function(parent, config,activateStore) {
  var rootEl = $("<div>", {
    class: "yashe"
  }).appendTo($(parent));
  config = extendConfig(config);
  var yashe = extendCmInstance(CodeMirror(rootEl[0], config));
  postProcessCmElement(yashe,activateStore);
  return yashe;
});





/**
 * Initialize YASHE from an existing text area (see http://codemirror.net/doc/manual.html#fromTextArea for more info)
 *
 * @method YASHE.fromTextArea
 * @param textArea {DOM element}
 * @param config {object}
 * @param {boolean} activateStore Set whether the shape will be store or not
 * @returns {doc} YASHE document
 */
root.fromTextArea = function(textAreaEl, config,activateStore) {
  config = extendConfig(config);
  //add yashe div as parent (needed for styles to be manageable and scoped).
  //In this case, I -also- put it as parent el of the text area. This is wrapped in a div now
  var rootEl = $("<div>", {
    class: "yashe"
  })
    .insertBefore($(textAreaEl))
    .append($(textAreaEl));
  var yashe = extendCmInstance(CodeMirror.fromTextArea(textAreaEl, config));
  postProcessCmElement(yashe,activateStore);
  return yashe;
};

/**
 * Extend config object, which we will pass on to the CM constructor later on.
 * Need this, to make sure our own 'onBlur' etc events do not get overwritten by
 * people who add their own onblur events to the config Additionally, need this
 * to include the CM defaults ourselves. CodeMirror has a method for including
 * defaults, but we can't rely on that one: it assumes flat config object, where
 * we have nested objects (e.g. the persistency option)
 *
 * @private
 */
var extendConfig = function(config) {
  var extendedConfig = $.extend(true, {}, root.defaults, config);
  // I know, codemirror deals with  default options as well.
  //However, it does not do this recursively (i.e. the persistency option)

  return extendedConfig;
};
/**
 * Add extra functions to the CM document (i.e. the codemirror instantiated
 * object)
 *
 * @private
 */
var extendCmInstance = function(yashe) {

  // Set editor default size
  yashe.setSize(null,"300")

  //instantiate autocompleters
  yashe.autocompleters = require("./autocompleters/autocompleterBase.js")(root, yashe);
  if (yashe.options.autocompleters) {
    yashe.options.autocompleters.forEach(function(name) {
      if (root.Autocompleters[name]) yashe.autocompleters.init(name, root.Autocompleters[name]);
    });
  }
  yashe.emit = function(event, data) {
    root.signal(yashe, event, data)
  }
  yashe.lastQueryDuration = null;
  yashe.getCompleteToken = function(token, cur) {
    return require("./utils/tokenUtils.js").getCompleteToken(yashe, token, cur);
  };
  yashe.getPreviousNonWsToken = function(line, token) {
    return require("./utils/tokenUtils.js").getPreviousNonWsToken(yashe, line, token);
  };
  yashe.getNextNonWsToken = function(lineNumber, charNumber) {
    return require("./utils/tokenUtils.js").getNextNonWsToken(yashe, lineNumber, charNumber);
  };
  yashe.collapsePrefixes = function(collapse) {
    if (collapse === undefined) collapse = true;
    yashe.foldCode(
      require("./prefixes/prefixFold.js").findFirstPrefixLine(yashe),
      root.fold.prefix,
      collapse ? "fold" : "unfold"
    );
  };  

 /**
	 * Fetch defined prefixes from query string
	 *
	 * @method doc.getPrefixesFromQuery
	 * @return object
	 */
  yashe.getPrefixesFromQuery = function() {
    return require("./utils/prefixUtils.js").getPrefixesFromQuery(yashe);
  };

  yashe.addPrefixes = function(prefixes) {
    return require("./utils/prefixUtils.js").addPrefixes(yashe, prefixes);
  };
  yashe.removePrefixes = function(prefixes) {
    return require("./utils/prefixUtils.js").removePrefixes(yashe, prefixes);
  };


  yashe.setCheckSyntaxErrors = function(isEnabled) {
    yashe.options.syntaxErrorCheck = isEnabled;
    checkSyntax(yashe);
  };

  yashe.enableCompleter = function(name) {
    addCompleterToSettings(yashe.options, name);
    if (root.Autocompleters[name]) yashe.autocompleters.init(name, root.Autocompleters[name]);
  };
  yashe.disableCompleter = function(name) {
    removeCompleterFromSettings(yashe.options, name);
  };
  return yashe;
};

var addCompleterToSettings = function(settings, name) {
  if (!settings.autocompleters) settings.autocompleters = [];
  settings.autocompleters.push(name);
};
var removeCompleterFromSettings = function(settings, name) {
  if (typeof settings.autocompleters == "object") {
    var index = $.inArray(name, settings.autocompleters);
    if (index >= 0) {
      settings.autocompleters.splice(index, 1);
      removeCompleterFromSettings(settings, name); //just in case. suppose 1 completer is listed twice
    }
  }
};

var postProcessCmElement = function(yashe,activateStore) {
  /**
	 * Set doc value
	 */
  if(activateStore){
    var storageId = utils.getPersistencyId(yashe, yashe.options.persistent);
    if (storageId) {
      var valueFromStorage = yutils.storage.get(storageId);
      if (valueFromStorage) yashe.setValue(valueFromStorage);
    }
  }

  /**
	 * Add event handlers
	 */
  yashe.on("blur", function(yashe, eventInfo) {
    root.storeQuery(yashe);
  });
  yashe.on("change", function(yashe, eventInfo) {
    checkSyntax(yashe);
  });
  yashe.on("changes", function() {
    checkSyntax(yashe);
  });

  yashe.on("scroll", function() {
    removeToolTip()
  });


  /**
   * Wikidata tooltip
   */
  CodeMirror.on( yashe.getWrapperElement(), 'mouseover',  debounce(function( e ) {  

    removeToolTip()
    triggerTooltip( e )

  }, 300 ))

  var triggerTooltip = function( e ) {
    var posX = e.clientX,
    posY = e.clientY + $( window ).scrollTop()

    var token = yashe.getTokenAt( yashe.coordsChar( {
      left: posX,
      top: posY
    } ) ).string;

  //Check wikidata prefixes
  var possibleEntity = token.split(':')[1]
  checkEntity(possibleEntity).done( function( data ) {
    if(!data.error){
      console.log(data)
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

  var removeToolTip = function() {
		$( '.wikibaseRDFtoolTip' ).remove();
	};


 
  yashe.prevQueryValid = false;
  checkSyntax(yashe); // on first load, check as well (our stored or default query might be incorrect)
};


root.storeQuery = function(yashe) {
  var storageId = utils.getPersistencyId(yashe, yashe.options.persistent);
  if (storageId) {
    yutils.storage.set(storageId, yashe.getValue(), "month", yashe.options.onQuotaExceeded);
  }
};


var checkSyntax = function(yashe, deepcheck) {
  return require("./utils/syntaxUtils.js").checkSyntax(yashe,deepcheck);
};



var debounce = function(func, wait, immediate) {
  var timeout, result;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
};

/**
 * Static Utils
 */
// first take all CodeMirror references and store them in the YASHE object
$.extend(root, CodeMirror);

//add registrar for autocompleters
root.Autocompleters = {};
root.registerAutocompleter = function(name, constructor) {
  root.Autocompleters[name] = constructor;
  addCompleterToSettings(root.defaults, name);
};

root.autoComplete = function(yashe) {
  //this function gets called when pressing the keyboard shortcut. I.e., autoShow = false
  yashe.autocompleters.autoComplete(false);
};
//include the autocompleters we provide out-of-the-box
root.registerAutocompleter("prefixes", require("./autocompleters/prefixes.js"));
root.registerAutocompleter("properties", require("./autocompleters/properties.js"));
root.registerAutocompleter("classes", require("./autocompleters/classes.js"));
root.registerAutocompleter("variables", require("./autocompleters/variables.js"));

 

/***
 * Format utils
 */
root.commentLines = function(yashe) {
  return require("./utils/formatUtils.js").commentLines(yashe);
};

root.copyLineUp = function(yashe) {
  return require("./utils/formatUtils.js").copyLineUp(yashe);
};

root.copyLineDown = function(yashe) {
  return require("./utils/formatUtils.js").copyLineDown(yashe);
};
root.doAutoFormat = function(yashe) {
  return require("./utils/formatUtils.js").doAutoFormat(yashe);
};



require("./config/defaults.js");
root.$ = $;
root.version = {
  CodeMirror: CodeMirror.version,
  YASHE: require("../package.json").version,
  jquery: $.fn.jquery,
  "yasgui-utils": yutils.version
};



var checkEntity = function (entity){
  return $.get(
    {
  
      url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids='+entity,
      dataType: 'jsonp',
  
    })
}


var selector = document.getElementById('exSelector')



var rdfShape 
var wikiShape 
var japanShape 

$.get('./src/rdfBookShape.txt', function(data) {
  rdfShape = data
 }, 'text');

 $.get('./src/wikidataShape.txt', function(data) {
  wikiShape = data
 }, 'text');

 $.get('./src/jps.txt', function(data) {
  japanShape = data
 }, 'text');


 selector.addEventListener('click', function(e) {
  if(selector.value == "rdf"){
    yashe.setValue(rdfShape)
    yashe.setSize(null,"250")
  }
   if(selector.value == "wiki"){
    yashe.setValue(wikiShape)
    yashe.setSize(null,"600")

   }
  if(selector.value == "japan"){
    yashe.setValue(japanShape)
    yashe.setSize(null,"600")
  }    

  $('.CodeMirror').css({"font-size":"12pxs"});

})

  




  