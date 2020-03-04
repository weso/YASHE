![YASHE](./doc/imgs/yashe_logo.png)

<p align="center">
  <a href="https://www.npmjs.com/package/yashe"><img src="https://img.shields.io/npm/v/yashe" alt="npm"/></a>
  <img src="https://img.shields.io/bundlephobia/min/yashe" alt="size"/>
  <img src="https://img.shields.io/github/languages/top/weso/YASHE?color=yellow" alt="languaje"/>
  <a href="http://www.weso.es/YASHE/"><img src="https://img.shields.io/website?url=http%3A%2F%2Fwww.weso.es%2FYASHE%2F" alt="web"/></a>
  
  
</p>

<p align="center">
  <a href="http://www.weso.es/"><img src="https://img.shields.io/badge/organization-WESO-FF2929" alt="organization"/></a>
  <a href="https://www.wikidata.org/wiki/Wikidata:Main_Page"><img src="https://img.shields.io/badge/poweredBy-Wikidata-00C472" alt="poweredBy"/></a>
 <img src="https://img.shields.io/github/license/weso/YASHE?color=A868E8" alt="license"/>
  <a href="http://shex.io/"><img src="https://img.shields.io/badge/tool-Text Editor-51CAFF" alt="editor"/></a>
  <a href="http://shex.io/"><img src="https://img.shields.io/badge/languaje-Shape Expressions (ShEx)-FF69B4" alt="editor"/></a>
</p>




# YASHE
*YASHE* (Yet Another ShEx Editor) is a [Shape Expressions (ShEx)](http://shex.io/) editor which started as a fork of [*YASQE*](http://yasqe.yasgui.org/) (which is based on SPARQL). 
This tool performs lexical and syntactic analysis of the content of the editor, thus offering the user a realtime syntactic error detector. It has features like: syntax highlighting, visual aid elements (tooltips) and
autocomplete mechanisms. 
In addition, it offers a simple way of integrating into other projects

<br>
<p align="center">
  <img src="https://github.com/weso/YASHE/blob/gh-pages/doc/imgs/yasheGIF.gif" alt="YASHE GIF"/>
</p>

## Documentation

* [Features](#Features)
* [Install](#Install)
  - [NPM](#NPM)
  - [JsDelivr](#JsDelivr)
  - [Github](#Github)
* [Configuration](#Configuration)
  - [Defaults](#Defaults)
  - [Shortcuts](#Shortcuts provided by YASHE)
* [API](#API)
* [Statics](#Statics)
* [Developing YASHE](#Developing YASHE)
* [Used By](#Used By)
* [Forked By](#Forked By)

## Features :clipboard:

* Completely client-side
* ShEx syntax highlighting and error checking
* Light and Dark modes
* Extremely customizable: All functions and handlers from the CodeMirror library are accessible
* Persistent values (optional): your query is stored for easier reuse between browser sessions
* Prefix definition autocompletion (using prefix.cc)
* Prefix and ShEx keywords autocompletion
* Wikidata property and entity autocompletion (using the MediaWiki API)
* Information tooltip when hovering over wikidata properties and entities (using the MediaWiki API)
* Handy keyboard shortcuts
* Integrated buttons that alows to:
     * Upload ShEx files
     * Download the editor content as a ShEx file
     * Copy the editor content to the clipboard
     * Delete all the editor content
     * Change between light and dark mode
     * FullScreen Mode

## Install :floppy_disk:

### NPM
YASHE is registered as a node package as well, so you'll be able to use the node package manager to keep your version of YASHE up to date. ([YASHE NPM Package](https://www.npmjs.com/package/yashe))
```
$ npm i yashe
```
### JsDelivr
The YASHE files are hosted via JsDelivr. This CDN is the easiest way to include YASHE in your website.

```html
<link href='https://cdn.jsdelivr.net/npm/yashe/dist/yashe.min.css' rel='stylesheet' type='text/css'/>
<script src='https://cdn.jsdelivr.net/npm/yashe/dist/yashe.bundled.min.js'></script>
```

### Github
Visit the [GitHub repository](https://github.com/weso/YASHE) to download the YASHE [.css](./dist/yashe.min.css) and [.js](./dist/yashe.bundled.min.js) files (find them in the dist directory).  

## Usage
You can initialize YASHE via its constructor, or via the command fromTextArea. Both return in instance of YASHE, from now on referred to as yashe (lowercase). Both function take as argument a config object (that can be null).
Main YASHE constructor. Pass a DOM element as argument to append the editor to, and (optionally) pass along config            settings. 
YASHE(parent: DOM-Element, settings: Object) → YASHE instance: yashe . 
[Codepen Example](https://codepen.io/mistermboy/pen/XWJpqdY)

```js
var yashe = YASHE(document.getElementById('domId'), {
  //Options
});
```

``


Initialize YASQE from an existing text area (see CodeMirror for more info)
YASHE.fromTextArea(textArea: DOM element, config: Object) → YASHE instance: yashe
[Codepen Example](https://codepen.io/mistermboy/pen/OJPWZWX)

```js
var yashe = YASHE.fromTextArea(document.getElementById('texAreaId'), {
  //Options
});
```
## Configuration
This configuration object is accessible/changeable via YASHE.defaults and yashe.options, and you can pass these along when initializing YASHE as well. Other than the configuration we describe here, check the CodeMirror documentation for even more options you can set, such as disabling line numbers, or changing keyboard shortcut keys.

```js
var yashe = YASHE(document.getElementById('domId'), {
  value:'Starting value of the editor',
  mode:'shex',
  theme:'wiki',
  lineNumbers: true,
  lineWrapping: true,
  firstLineNumber:1,
  cursorHeight:15,
  readOnly:false,
  showCursorWhenSelecting:fasle,
  tabMode: 'indent',
  collapsePrefixesOnLoad: false,
  matchBrackets: true,
  fixedGutter: true,
  syntaxErrorCheck: true,
  showTooltip:true,
  persistent:null,
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
    }
});
```

### Defaults

```
value: string
```
Default Shape
```
autocompleters: array (default: ["prefixDefinition", "wikidata", "prefixesAndKeywords"])
```
The list of enabled autocompletion plugins
```
syntaxErrorCheck: boolean (default: true)
```
Whether to validate the ShEx syntax
```
collapsePrefixesOnLoad: boolean (default: false)
```
Collapse prefixes on page load
```
extraKeys: object
```
Extra shortcut keys. Check the [CodeMirror manual](https://codemirror.net/) on how to add your own
Note: To avoid colissions with other browser shortcuts, these shortcuts only work when the YASHE editor is selected (has 'focus').

### Shortcuts provided by YASHE:
 
  Shortcut          | Action
  -------------     | -------------
  Ctrl/Cmd-Space    | Trigger Autocompletion
  Ctrl/Cmd-D        | Delete current/selected line(s)
  Ctrl/Cmd-Space    | Comment or uncomment current/selected line(s)
  Ctrl/Cmd-Down     | Copy line down
  Ctrl/Cmd-Up       | Copy line up
  Ctrl/Cmd-Shift-F  | Auto-format/indent selected lines
  Ctrl/Cmd-S        | Save current content in local storage
  Ctrl/Cmd-Z        | Undo
  Ctrl/Cmd-Y        | Redo
  F11               | Set query editor full-screen (or leave full-screen)
  Esc               | Leave full-screen


```
persistent: function|string
```
Change persistency settings for the YASHE content value. Setting the values to null, will disable persistancy: nothing is stored between browser sessions. Setting the values to a string (or a function which returns a string), will store the query in localstorage using the specified string. By default, the ID is dynamically generated using the YASHE.determineId function, to avoid collissions when using multiple YASHE instances on one page



## API
API methods accessible via the yashe instance:

```js
//Set query value in editor (see also)
yashe.setValue(query: String)

// Get query value from editor (see also)
yashe.getValue() → query: String

// Fetch defined prefixes
yashe.getDefinedPrefixes() → object:

// Add prefixes to the query. The prefixes are defined as 
// {"rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"}
yashe.addPrefixes(prefixes: object)

// Remove prefixes from query. The prefixes are defined as 
// {"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"}
yashe.removePrefixes(prefixes: object)

// Set size. Use null value to leave width or height unchanged. 
// To resize the editor to fit its content, see //http://codemirror.net/demo/resize.html
yashe.setSize(width: Number|string, height: Number|string)

// Enable an autocompleter with this name. Only makes sense if you've programatically 
// disabled this completer before, as a plugin is automatically enabled when registering it 
// (see this function)
yashe.enableCompleter(completerName: String)

// Disable an autocompleter with this name.
yashe.disableCompleter(completerName: String)

// Store bulk completions in memory as trie, and in localstorage as well (if enabled). 
// The argument should be a key from the //autocompletion settings
yashe.storeBulkCompletions(type: String)

// Collapsing prefixes if there are any. Use false to expand them.
yashe.collapsePrefixes(collapse: boolean)

```

## Statics
Static functions YASHE
```js
// Register an autocompleter in YASHE. This automatically enables the completer as well
YASHE.registerAutocompleter(name: String, autocompleter: function)

// When typing a shape, this shape is sometimes syntactically invalid, 
// causing the current tokens to be incorrect.
// This causes problem for autocompletion. http://bla might result in two tokens: http:// and bla. 
// We'll want to combine these
YASHE.getCompleteToken(doc: yashe, token: Object, cursor: Object) //→ token: Object

```

## Developing YASHE :construction:
Feel free to fork and develop this tool.  You can submit your
contributions as Github pull requests.  To develop *YASHE* locally:

* `npm install`
* `npm run dev` for local development

## Used By: :link:

* [ShExAuthor](https://github.com/weso/shex-author): ShEx Graphic Assistant
* [RDFShape](http://rdfshape.weso.es/): RDF service for conversion and validation using ShEX and SHACL
* [WikiShape](http://wikishape.weso.es/): Shape Expressions playground customized for Wikidata
* [ShExML](http://shexml.herminiogarcia.com/) Playground to convert ShExML to RDF and RML offering diferent syntaxes

## Forked By: :link:
* [ShExML Editor](http://shexml.herminiogarcia.com/) ShExML is a language based on ShEx to map and merge heterogeneous data sources. It is designed with usability in mind trying to make the script creation easier to the user
