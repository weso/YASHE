![YASHE](./doc/imgs/yashe_logo.png)


# YASHE
*YASHE* (Yet Another ShEx Editor) is a [Shape Expressions (ShEx)](http://shex.io/) editor which started as a fork of [*YASQE*](http://yasqe.yasgui.org/) (which is based on SPARQL). 
This tool performs lexical and syntactic analysis of the content of the editor, thus offering the user a realtime syntactic error detector. It has features like: syntax highlighting, visual aid elements (tooltips) and
autocomplete mechanisms. 
In addition, it offers a simple way of integrating into other projects
# [![Build Status](https://travis-ci.com/weso/YASHE.svg?branch=gh-pages)](https://travis-ci.com/weso/YASHE)
<p align="center">
  <img src="https://github.com/weso/YASHE/blob/gh-pages/doc/imgs/yasheGIF.gif" alt="YASHE GIF"/>
</p>


## Table of Contents

* [Features](#features-clipboard)
* [Install](#install-floppy_disk)
  - [NPM](#NPM)
  - [JsDelivr](#JsDelivr)
  - [Github](#Github)
* [Getting Started](#Getting-started)
  - [React.js](#Reactjs)
* [Configuration](#Configuration)
* [Events](#Events)
    - [Event Handlers](#event-handlers)
    - [Fire your own events](#fire-your-own-events)
* [Shortcuts](#shortcuts-provided-by-yashe)
* [API](#API)
* [Statics](#Statics)
* [Developing YASHE](#developing-yashe-construction)
* [Used By](#used-by-link)
* [Forked By](#forked-by-link)

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

<p align="center">
  <img src="https://github.com/mistermboy/YASHE/blob/gh-pages/doc/imgs/wikiGIF.gif" alt="YASHE GIF"/>
</p>

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

## Getting Started
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
### React.js
This is a basic example about how to use YASHE in React.js using hooks:
```js
import React, {useState,useEffect,useRef} from 'react';
import YASHE from 'yashe';

function Editor() {

  const [yashe,setYashe] = useState(null);
  const divRef = useRef(null);

    useEffect(() => {
    
        if (!yashe) {
            const options = {
                persistent:false,
                lineNumbers: true,
            }
            
            const y = YASHE(divRef.current,options);
        
            y.refresh();
            setYashe(y);           
          }
      }, [yashe]
    );
    return  (<div ref={divRef}/>);
}

export default Editor;
```


## Configuration
This configuration object is accessible/changeable via YASHE.defaults and yashe.options, and you can pass these along when initializing YASHE as well. Other than the configuration we describe here, check the CodeMirror documentation for even more options you can set, such as disabling line numbers, or changing keyboard shortcut keys.

```js
var yashe = YASHE(document.getElementById('domId'), {
  value:'Starting value of the editor',
  mode:'shex',
  theme:'wiki', //dark
  lineNumbers: true,
  lineWrapping: true,
  fontSize: 14, 
  cursorHeight:15,
  firstLineNumber:1,
  readOnly:false,
  showCursorWhenSelecting:fasle,
  tabMode: 'indent',
  collapsePrefixesOnLoad: false,
  matchBrackets: true,
  fixedGutter: true,
  syntaxErrorCheck: true,
  showTooltip: true,
  showUploadButton: true,
  showDownloadButton: true,
  showCopyButton: true,
  showDeleteButton: true,
  showThemeButton: true,
  showFullScreenButton: true,
  persistent: null,
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
## Events
Here are some events provided by YASHE (check the [Codemirror Documentation](https://codemirror.net/doc/manual.html#events) for more info ):

  Event             | Objects              | Action
  ----------------  | ---------------------| ------------------------ 
  change          |  yashe: CodeMirror,    changeObj: object | Fires every time the content of the editor is changed
  cursorActivity    |  yashe: CodeMirror  | Will be fired when the cursor or selection moves, or any change is made to the editor content. 
  keyHandled        |  yashe: CodeMirror,name: string,event: Event | Fired after a key is handled through a key map
  focus          |  yashe: CodeMirror, event: Event | Fires whenever the editor is focused
  blur           |  yashe: CodeMirror, event: Event | Fires whenever the editor is unfocused
  scroll         |  yashe: CodeMirror | Fires whenever the editor is scrolled
  refresh        |  yashe: CodeMirror | Fires when the editor is refreshed or resized
  optionChange   |  yashe: CodeMirror, option: string | Dispatched every time an option is changed with setOption
  upload         |  yashe: CodeMirror        | Fires after uploading a file by the upload button
  download       |  yashe: CodeMirror        | Fires after downloading a file by the download button
  copy           |  yashe: CodeMirror        | Fires after copying the editor content using the copy button 
  themeChange    |  yashe: CodeMirror        | Fires after changing the editor theme using the change theme button 
  delete         |  yashe: CodeMirror        | Fires after deleting the editor content by the delete buttton
  expandScreen   |  yashe: CodeMirror        | Fires after expanding screen
  collapseScreen |  yashe: CodeMirror        | Fires after collapsing screen
  
  
### Event Handlers
`cm.on(type: string, func: (...args))`

Register an event handler for the given event type (a string) on the editor instance. There is also a CodeMirror.on(object, type, func) version that allows registering of events on any object.

```js
yashe.on('blur', function(yashe) {
 console.log('The editor has been unfocused!');
});
```

`cm.off(type: string, func: (...args))`

Remove an event handler on the editor instance. An equivalent CodeMirror.off(object, type, func) also exists.

```js
yashe.off('blur');
```
### Fire your own events
`CodeMirror.signal(target, name, args...)`
```js
Codemirror.signal(yashe,'myOwnEvent'args...);
```

## Shortcuts provided by YASHE:
 
  Shortcut          | Action
  -------------     | -------------
  Ctrl/Cmd-Space    | Trigger Autocompletion
  Ctrl/Cmd-D        | Delete current/selected line(s)
  Ctrl/Cmd-/        | Comment or uncomment current/selected line(s)
  Ctrl/Cmd-Down     | Copy line down
  Ctrl/Cmd-Up       | Copy line up
  Ctrl/Cmd-Shift-F  | Auto-format/indent selected lines
  Ctrl/Cmd-S        | Save current content in local storage
  Ctrl/Cmd-Z        | Undo
  Ctrl/Cmd-Y        | Redo
  F11               | Set query editor full-screen (or leave full-screen)
  Esc               | Leave full-screen


## API
API methods accessible via the yashe instance ( check the [Codemirror Manual](https://codemirror.net/doc/manual.html#api) for more info:

```js
// Get query value from editor
yashe.getValue() → query: String

//Set query value in editor
yashe.setValue(query: String)

// Get the content of line n.
yashe.getLine(n: integer) → string

// Get the number of lines in the editor.
yashe.lineCount() → integer

// Get the number of first line in the editor. 
yashe.firstLine() → integer

// Get the number of last line in the editor. 
yashe.lastLine() → integer

// Get the currently selected code. 
// Optionally pass a line separator to put between the lines in the output. 
// When multiple selections are present, they are concatenated with instances 
// of lineSep in between.
yashe.getSelection(?lineSep: string) → string


// Replace the selection(s) with the given string. By default, the new selection 
// ends up after the inserted text. The optional select argument can be used to 
// change this—passing "around" will cause the new text to be selected, passing 
// "start" will collapse the selection to the start of the inserted text.
yashe.replaceSelection(replacement: string, ?select: string)

// Retrieve one end of the primary selection. start is an optional string indicating 
// which end of the selection to return. It may be "from", "to", "head" (the side of 
// the selection that moves when you press shift+arrow), or "anchor" (the fixed side 
// of the selection). Omitting the argument is the same as passing "head". A {line, ch} 
// object will be returned.
yashe.getCursor(?start: string) → {line, ch}

// Return true if any text is selected
yashe.somethingSelected() → boolean

// Set the cursor position. You can either pass a single {line, ch} object, or the line 
// and the character as two separate parameters. Will replace all selections with a single, 
// empty selection at the given position
yashe.setCursor(pos: {line, ch}|number, ?ch: number, ?options: object)

// Tells you whether the editor currently has focus.
yashe.hasFocus() → boolean

// Returns the start and end of the 'word' (the stretch of letters, whitespace, or 
// punctuation) at the given position.
yashe.findWordAt(pos: {line, ch}) → {anchor: {line, ch}, head: {line, ch}}


// Retrieves the current value of the given option for this editor instance.
yashe.getOption(option: string) → any

// Change the configuration of the editor. option should the name of an option, 
// and value should be a valid value for that option.
yashe.setOption(option: string, value: any)

// Retrieve the currently active document from an editor.
yashe.getDoc() → Doc

// Retrieve the editor associated with a document. May return null.
yashe.getEditor() → CodeMirror

// Undo one edit (if any undo events are stored).
yashe.undo()

// Redo one undone edit.
yashe.redo()

// Programmatically set the size of the editor (overriding the applicable CSS rules). 
// width and height can be either numbers (interpreted as pixels) or CSS units (e.g "100%"). 
// You can pass null for either of them to indicate that that dimension should not be changed.
yashe.setSize(width: number|string, height: number|string)

// Scroll the editor to a given (pixel) position. Both arguments may be left as null 
// or undefined to have no effect.
yashe.scrollTo(x: number, y: number)

// If your code does something to change the size of the editor element (window resizes 
// are already listened for), or unhides it, you should probably follow up by calling 
// this method to ensure CodeMirror is still looking as intended.
yashe.refresh()

//Retrieves information about the token the current mode found before the given 
// position (a {line, ch} object). The returned object has the following properties:
// start -> The character (on the given line) at which the token starts
// end -> The character at which the token ends.
// string->The token's string.
// type -> The token type the mode assigned to the token, such as "keyword" or 
//         "comment" (may also be null).
// state -> The mode's state at the end of this token.
yashe.getTokenAt(pos: {line, ch}, ?precise: boolean) → object

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
