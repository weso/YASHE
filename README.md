![YASHE](./doc/imgs/yashe_logo.png)

[![NPM](https://img.shields.io/npm/v/yashe)](https://www.npmjs.org/package/yashe)
![TOP](https://img.shields.io/github/languages/top/weso/YASHE?color=yellow)
![ISUES](https://img.shields.io/github/issues/weso/YASHE?color=green)
![LICENSE](https://img.shields.io/github/license/weso/YASHE?color=blueviolet)

*YASHE* (Yet Another ShEx Editor) is a [ShEx](http://shex.io/) editor which started as a fork of [*YASQE*](http://yasqe.yasgui.org/) (which is based on SPARQL). For more information about *YASHE*, its features, and a HOWTO
for including it in your own web site, visit http://www.weso.es/YASHE/

## Download the latest release

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


## Use YASHE on your own project
You can initialize YASHE via its constructor, or via the command fromTextArea. Both return in instance of YASHE, from now on referred to as yashe (lowercase). Both function take as argument a config object (that can be null).

`YASHE(parent: DOM-Element, settings: Object) → YASHE instance: yashe`

Main YASHE constructor. Pass a DOM element as argument to append the editor to, and (optionally) pass along config            settings (see the YASHE.defaults object below, as well as the regular CodeMirror documentation, for more information on      configurability)

`YASHE.fromTextArea(textArea: DOM element, config: Object) → YASHE instance: yashe`

Initialize YASQE from an existing text area (see CodeMirror for more info)


[Here](https://gist.github.com/mistermboy/843d5633e5408d7d79a37b890da167f3) you can see a code example of the two diferent ways to initialize YASHE

## Developing YASHE

Feel free to fork and develop this tool.  You can submit your
contributions as Github pull requests.  To develop *YASHE* locally:

* `npm install`
* `npm run dev` for local development
