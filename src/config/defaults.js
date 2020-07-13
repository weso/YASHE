/**
 * The default options of YASHE (check the CodeMirror documentation for even
 * more options, such as disabling line numbers, or changing keyboard shortcut
 * keys). Either change the default options by setting YASHE.defaults, or by
 * passing your own options as second argument to the YASHE constructor
 */
var $ = require("jquery"), YASHE = require("../main.js"), CodeMirror = require('codemirror');

YASHE.defaults = $.extend(true, {}, YASHE.defaults, {
  mode: "shex",

  /**
	 *  Default shape 
	 */
  value:  `PREFIX p:    <http://www.wikidata.org/prop/>
  PREFIX ps:   <http://www.wikidata.org/prop/statement/>
  PREFIX pq:   <http://www.wikidata.org/prop/qualifier/>
  PREFIX wd:   <http://www.wikidata.org/entity/>
  PREFIX wdt:  <http://www.wikidata.org/prop/direct/>
  PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
  
  start = @<#operating_system>
  
  <#operating_system> {
    p:P31  [ wd:Q9135 ] ;  #instancia de #sistema operativo  
    p:P31  [ wd:Q42 ] ;  #instancia de #Douglas Adams  
    p:P31  [ wd:Q5 ] #instancia de #ser humano  
  }
  
  
  

  
`,

  highlightSelectionMatches: {
    showToken: /\w/
  },
  theme:"wiki",
  tabMode: "indent",
  fontSize: 14, 
  lineNumbers: true,
  lineWrapping: true,
  foldGutter: {
    rangeFinder: new YASHE.fold.combine(YASHE.fold.brace, YASHE.fold.prefix)
  },
  collapsePrefixesOnLoad: false,
  gutters: ["gutterErrorBar", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  matchBrackets: true,
  fixedGutter: true,
  syntaxErrorCheck: true,
  showTooltip: true,
  showShareButton: true,
  showUploadButton: true,
  showDownloadButton: true,
  showCopyButton: true,
  showDeleteButton: true,
  showThemeButton: true,
  showFullScreenButton: true,
  onQuotaExceeded: function(e) {
    //fail silently
    console.warn("Could not store in localstorage. Skipping..", e);
  },
  /**
	 * Extra shortcut keys. Check the CodeMirror manual on how to add your own
	 *
	 * @property extraKeys
	 * @type object
	 */
  extraKeys: {
    "Ctrl-Space": YASHE.autoComplete,
    "Cmd-Space": YASHE.autoComplete,
    "Ctrl-D": YASHE.deleteLine,
    "Cmd-K": YASHE.deleteLine,
    "Ctrl-/": YASHE.commentLines,
    "Cmd-/": YASHE.commentLines,
    "Ctrl-Down": YASHE.copyLineDown,
    "Ctrl-Up": YASHE.copyLineUp,
    "Cmd-Down": YASHE.copyLineDown,
    "Cmd-Up": YASHE.copyLineUp,
    "Shift-Ctrl-F": YASHE.doAutoFormat,
    "Shift-Cmd-F": YASHE.doAutoFormat,
    "Ctrl-S": YASHE.storeContent,
    "Cmd-S": YASHE.storeConten,
    "Ctrl-Enter": YASHE.executeQuery,
    "Cmd-Enter": YASHE.executeQuery,
    "Ctrl-F": YASHE.prettify,
    "Cmd-F": YASHE.prettify,
    F11: function(yashe) {
      yashe.setOption("fullScreen", !yashe.getOption("fullScreen"));
      if(yashe.getOption("fullScreen")){
        CodeMirror.signal(yashe,'expandScreen');
      }else{
        CodeMirror.signal(yashe,'collapseScreen');
      }
    },
    Esc: function(yashe) {
      if (yashe.getOption("fullScreen")){
        yashe.setOption("fullScreen", false);
        CodeMirror.signal(yashe,'collapseScreen');
      } 
    }
  },
  cursorHeight: 0.9,
  createShareLink: YASHE.createShareLink,
  consumeShareLink: YASHE.consumeShareLink,

  
  /**
	 * Change persistency settings for the YASHE value. Setting the values
	 * to null, will disable persistancy: nothing is stored between browser
	 * sessions Setting the values to a string (or a function which returns a
	 * string), will store the ShEx doc in localstorage using the specified string.
	 * By default, the ID is dynamically generated using the closest dom ID, to avoid collissions when using multiple YASHE items on one
	 * page
	 *
	 * @type function|string
	 */
  persistent: function(yashe) {
    return "yashe_" + $(yashe.getWrapperElement()).closest("[id]").attr("id") + "_queryVal";
  },

});
