'use strict';
// make sure any console statements
window.console = window.console || {
  log: function() {},
};


/**
 * Load libraries and utils
 */
const $ = require('jquery');
const codeMirror = require('codemirror');
const utils = require('./utils/baseUtils.js');
const yutils = require('yasgui-utils');
const prefixUtils = require('./utils/prefixUtils.js');
const tokenUtils = require('./utils/tokenUtils.js');
const syntaxUtils = require('./utils/syntaxUtils.js');
const tooltipUtils = require('./utils/tooltipUtils.js');
const formatUtils = require('./utils/formatUtils.js');
const buttonsUtils = require('./utils/buttonsUtils.js');
const prefixFold = require('./utils/prefixFold.js');
const autocompletersBase = require('./autocompleters/autocompleterBase.js');
const Clipboard = require('clipboard');

require('../lib/deparam.js');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/hint/show-hint.js');
require('codemirror/addon/search/searchcursor.js');
require('codemirror/addon/edit/matchbrackets.js');
require('codemirror/addon/runmode/runmode.js');
require('codemirror/addon/display/fullscreen.js');
require('../lib/grammar/tokenizer.js');

/**
 * Main YASHE constructor.
 * Pass a DOM element as argument to append the editor to,
 * and (optionally) pass along config settings
 * (see the YASHE.defaults object below,
 * as well as the regular codeMirror documentation,
 * for more information on configurability)
 *
 * @constructor
 * @param {DOM-Element} parent element to append editor to.
 * @param {object} config
 * @class YASHE
 * @return {doc} YASHE document
 */
const root = (module.exports = function(parent, config) {
  const rootEl = $('<div>', {
    class: 'yashe',
  }).appendTo($(parent));
  config = extendConfig(config);
  const yashe = extendCmInstance(codeMirror(rootEl[0], config));
  postProcessCmElement(yashe);
  return yashe;
});


/**
 * Extend config object, which we will pass on to the CM constructor later on.
 * Need this, to make sure our own 'onBlur' etc events do not get overwritten by
 * people who add their own onblur events to the config Additionally, need this
 * to include the CM defaults ourselves. codeMirror has a method for including
 * defaults, but we can't rely on that one: it assumes flat config object, where
 * we have nested objects (e.g. the persistency option)
 *
 * @private
 * @param {object} config
 * @return {object} YASHE config
 */
const extendConfig = function(config) {
  const extendedConfig = $.extend(true, {}, root.defaults, config);
  // I know, codemirror deals with  default options as well.
  // However, it does not do this recursively (i.e. the persistency option)

  return extendedConfig;
};
/**
 * Add extra functions to the CM document (i.e. the codemirror instantiated
 * object)
 *
 * @private
 * @param {object} yashe
 * @return {doc} YASHE document
 */
const extendCmInstance = function(yashe) {
  // instantiate autocompleters
  yashe.autocompleters = autocompletersBase(root, yashe);
  if (yashe.options.autocompleters) {
    yashe.options.autocompleters.forEach(function(name) {
      if (root.Autocompleters[name]) {
        yashe.autocompleters.init(name, root.Autocompleters[name]);
      }
    });
  }


  /**
   * Returns the entire token by the cursor
   * @return {object} token
  */
  yashe.getCompleteToken = function() {
    return tokenUtils.getCompleteToken(yashe);
  };

  /**
   * Returns the previous token that is not a WS token
   * @param {onject} line
   * @param {onject} token
   * @return {object} token
  */
  yashe.getPreviousNonWsToken = function(line, token) {
    return tokenUtils.getPreviousNonWsToken(yashe, line, token);
  };

  /**
   * Returns the next token that is not a WS token
   * @param {onject} lineNumber
   * @param {onject} charNumber
   * @return {object} token
  */
  yashe.getNextNonWsToken = function(lineNumber, charNumber) {
    return tokenUtils.getNextNonWsToken(yashe, lineNumber, charNumber);
  };

  /**
   * Colapse all prefixes of the ShEx documment
   * @param {boolean} collapse
  */
  yashe.collapsePrefixes = function(collapse) {
    if (collapse === undefined) collapse = true;
    yashe.foldCode(
     prefixFold.findFirstPrefixLine(yashe),
      root.fold.prefix,
      collapse ? "fold" : "unfold"
    );
  };

 /**
  * Returns true if yashe has syntax errors. False otherwise
  * @param {object} yashe
  * @return {boolean} 
  */
  yashe.hasErrors = function() {
    return !syntaxUtils.checkSyntax(yashe);
  }
  

  /**
   * Fetch defined prefixes
   * @method doc.getDefinedPrefixes
   * @return {object} prefixes
   */
  yashe.getDefinedPrefixes = function() {
    return prefixUtils.getDefinedPrefixes(yashe);
  };

  /**
   * Add prefixes to the ShEx documment
   * @param {string|list} prefixes String if you want to add just one
   * List in other case
   */
  yashe.addPrefixes = function(prefixes) {
    prefixUtils.addPrefixes(yashe, prefixes);
  };

  /**
   * Remove prefixes from the ShEx documment
   * @param {list} prefixes
   */
  yashe.removePrefixes = function(prefixes) {
    prefixUtils.removePrefixes(yashe, prefixes);
  };


  /**
   * Allows to enable or disable Systax error checker
   * @param {boolean} isEnabled
   */
  yashe.setCheckSyntaxErrors = function(isEnabled) {
    yashe.options.syntaxErrorCheck = isEnabled;
    checkSyntax(yashe);
  };

  /**
   * Enables the autocompleter that you pass by param
   * @param {string} name The name of the autocompleter
   */
  yashe.enableCompleter = function(name) {
    addCompleterToSettings(yashe.options, name);
    if (root.Autocompleters[name]) {
      yashe.autocompleters.init(name, root.Autocompleters[name]);
    }
  };

  /**
   * Disables the autocompleter that you pass by param
   * @param {string} name The name of the autocompleter
   */
  yashe.disableCompleter = function(name) {
    removeCompleterFromSettings(yashe.options, name);
  };
  return yashe;
};

/**
 * Creates autocompleters list in the settigns if it does not exit
 * Add the autocompleter that you pass by param to the atucompleters settigns.
 * @param {object} settings YASHE settings
 * @param {string} name Autocompleter name
 */
const addCompleterToSettings = function(settings, name) {
  if (!settings.autocompleters) settings.autocompleters = [];
  settings.autocompleters.push(name);
};

/**
 * Remove the autocompleter that you pass by param from the
 * autocompleters settigns.
 * @param {object} settings YASHE settings
 * @param {string} name Autocompleter name
 */
const removeCompleterFromSettings = function(settings, name) {
  if (typeof settings.autocompleters == 'object') {
    const index = $.inArray(name, settings.autocompleters);
    if (index >= 0) {
      settings.autocompleters.splice(index, 1);
      // just in case. suppose 1 completer is listed twice
      removeCompleterFromSettings(settings, name);
    }
  }
};

/**
 * Add extra funcionalitys to YASHE
 * @param {object} yashe
 */
const postProcessCmElement = function(yashe) {
  buttonsUtils.drawButtons(yashe);

  // Trigger of the button with id='copy'
  // Copies the contents of the editor in the clipboard
  new Clipboard('#copyBtn', {
    text: function(trigger) {
      return yashe.getValue();
    },
  });


  /**
   * Set doc value if option storeShape is activated
   */
  const storageId = utils.getPersistencyId(yashe, yashe.options.persistent);
  if (storageId) {
    const valueFromStorage = yutils.storage.get(storageId);
    if (valueFromStorage) yashe.setValue(valueFromStorage);
  }


  // --- Event handlers ----

  /**
   * Fires whenever the editor is unfocused.
   * In this case, YASHE stores it content
   */
  yashe.on('blur', function(yashe) {
    root.storeContent(yashe);
  });

  /**
   * Fires every time the content of the editor is changed.
   * In this case, YASHE checks the sintax
   */
  yashe.on('change', function(yashe) {
    //Needed. Without the timeout there is a bug 
    //that forfces you to do a Space after type a token to fix it
    setTimeout(() => {
      checkSyntax(yashe);  
    }, 10);
  });

  /**
   * Fires when the editor is scrolled.
   * In this case, YASHE removes Wikidata Tooltip
   */
  yashe.on('scroll', function() {
    tooltipUtils.removeWikiToolTip();
  });


  /**
   * Wikidata Tooltip Listener
   */

  root.on( yashe.getWrapperElement(), 'mouseover',
      tooltipUtils.debounce(function( e ) {
        if(yashe.options.showTooltip){
          tooltipUtils.removeWikiToolTip();
          tooltipUtils.triggerTooltip(yashe, e);
        }
      }, 300 ));


  // on first load, check as well
  // (our stored or default query might be incorrect)
  checkSyntax(yashe);

  if (yashe.options.collapsePrefixesOnLoad){
    yashe.collapsePrefixes(true);
  } 

};


/**
 * Stores YASHE content
 * @param {object} yashe
 */
root.storeContent = function(yashe) {
  const storageId = utils.getPersistencyId(yashe, yashe.options.persistent);
  if (storageId) {
    yutils.storage.set(storageId, yashe.getValue(),
        'month', yashe.options.onQuotaExceeded);
  }
};

/**
 * Checks YASHE content syntax
 * @param {object} yashe
 * @return {string} Check result
 */
const checkSyntax = function(yashe) {
  return syntaxUtils.checkSyntax(yashe);
};


// ---- Static Utils -----

// first take all codeMirror references and store them in the YASHE object
$.extend(root, codeMirror);

// add registrar for autocompleters
root.Autocompleters = {};
root.registerAutocompleter = function(name, constructor) {
  root.Autocompleters[name] = constructor;
  addCompleterToSettings(root.defaults, name);
};

root.autoComplete = function(yashe) {
  // this function gets called when pressing the keyboard shortcut.
  // I.e., autoShow = false
  yashe.autocompleters.autoComplete(false);
};

// include the autocompleters we provide out-of-the-box
root.registerAutocompleter('wikidata',
    require('./autocompleters/wikidata.js'));

root.registerAutocompleter('prefixDefinition',
    require('./autocompleters/prefixDefinition.js'));

root.registerAutocompleter('prefixesAndKeywords',
    require('./autocompleters/prefixesAndKeywords.js'));


/**
 * Initialize YASHE from an existing text area (see http://codemirror.net/doc/manual.html#fromTextArea for more info)
  *
 * @method YASHE.fromTextArea
 * @param {DOM-element} textAreaEl
 * @param {object} config
 * @return {doc} YASHE document
 */
root.fromTextArea = function(textAreaEl, config) {
  config = extendConfig(config);
  // add yashe div as parent (needed for styles to be manageable and scoped).
  // In this case, I -also- put it as parent el of the text area.
  // This is wrapped in a div now

  $('<div>', {
    class: 'yashe',
  }).insertBefore($(textAreaEl))
      .append($(textAreaEl));


  const yashe = extendCmInstance(codeMirror.fromTextArea(textAreaEl, config));
  postProcessCmElement(yashe);

  return yashe;
};


// ---- Format utils -----

/**
 * Comment or uncomment current/selected line(s)
 * @param {object} yashe
 */
root.commentLines = function(yashe) {
  formatUtils.commentLines(yashe);
};

/**
 * Copy line up
 * @param {object} yashe
 */
root.copyLineUp = function(yashe) {
  formatUtils.copyLineUp(yashe);
};

/**
 * Copy line down
 * @param {object} yashe
 */
root.copyLineDown = function(yashe) {
  formatUtils.copyLineDown(yashe);
};

/**
 * Auto-format/indent selected lines
 * @param {object} yashe
 */
root.doAutoFormat = function(yashe) {
  formatUtils.doAutoFormat(yashe);
};


require('./config/defaults.js');
root.$ = $;
root.version = {
  'codeMirror': codeMirror.version,
  'YASHE': require('../package.json').version,
  'jquery': $.fn.jquery,
  'yasgui-utils': yutils.version,
};

