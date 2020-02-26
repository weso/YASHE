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
 * Shortcuts:
 
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


## Download the latest release :small_red_triangle_down:

### ![JsDelivr](./doc/imgs/JsDelivr_logo.png)
The YASHE files are hosted via JsDelivr. This CDN is the easiest way to include YASHE in your website.

#### CSS
     <link href='https://cdn.jsdelivr.net/npm/yashe@1.1.1/dist/yashe.min.css' rel='stylesheet' type='text/css'/>
  
#### JS 
     <script src='https://cdn.jsdelivr.net/npm/yashe@1.1.1/dist/yashe.bundled.min.js'></script>



### ![Github](./doc/imgs/github_logo.png)
Visit the [GitHub repository](https://github.com/weso/YASHE) to download the YASHE [.css](./dist/yashe.min.css) and [.js](./dist/yashe.bundled.min.js) files (find them in the dist directory).  


### ![NPM](./doc/imgs/npm_logo.png)
YASHE is registered as a node package as well, so you'll be able to use the node package manager to keep your version of YASHE up to date. ([YASHE NPM Package](https://www.npmjs.com/package/yashe))


## Use YASHE on your own project  :round_pushpin:
You can initialize YASHE via its constructor, or via the command fromTextArea. Both return in instance of YASHE, from now on referred to as yashe (lowercase). Both function take as argument a config object (that can be null).

`YASHE(parent: DOM-Element, settings: Object) → YASHE instance: yashe`

Main YASHE constructor. Pass a DOM element as argument to append the editor to, and (optionally) pass along config            settings (see the YASHE.defaults object below, as well as the regular CodeMirror documentation, for more information on      configurability)

Check [Codepen Example](https://codepen.io/mistermboy/pen/XWJpqdY)

`YASHE.fromTextArea(textArea: DOM element, config: Object) → YASHE instance: yashe`

Initialize YASQE from an existing text area (see CodeMirror for more info)

Check [Codepen Example](https://codepen.io/mistermboy/pen/OJPWZWX)


[Here](https://gist.github.com/mistermboy/843d5633e5408d7d79a37b890da167f3) you can see a code example of the two diferent ways to initialize YASHE


## Developing YASHE :construction:

Feel free to fork and develop this tool.  You can submit your
contributions as Github pull requests.  To develop *YASHE* locally:

* `npm install`
* `npm run dev` for local development

## Used By: :link:

* [ShExAuthor](https://github.com/weso/shex-author): ShEx Graphic Assistant
* [RDFShape](http://rdfshape.weso.es/): RDF service for conversion and validation using ShEX and SHACL
* [WikiShape](http://wikishape.weso.es/): Shape Expressions playground customized for Wikidata

