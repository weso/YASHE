const YASHE = require('../src/main.js');
var $ = jQuery = require("jquery");

let yashe = YASHE(null, {
    persistent:null
});






//Autocompleters
test('Default autocompleters', ()=>{
    let autocompleters = yashe.options.autocompleters;
    expect(autocompleters.length==3).toBeTruthy();
});

test('Wikidata autocompleter', ()=>{
    let autocompleters = yashe.options.autocompleters;
    expect(autocompleters[0]=='wikidata').toBeTruthy();
});

test('PrefixDefinition autocompleter', ()=>{
    let autocompleters = yashe.options.autocompleters;
    expect(autocompleters[1]=='prefixDefinition').toBeTruthy();
});

test('PrefixesAndKeywords autocompleter', ()=>{
    let autocompleters = yashe.options.autocompleters;
    expect(autocompleters[2]=='prefixesAndKeywords').toBeTruthy();
});


test('Default CollapsePrefixesOnLoad', ()=>{
    let prefixes = yashe.options.collapsePrefixesOnLoad;
    expect(prefixes==false).toBeTruthy();
});

test('Default CursorHeight', ()=>{
    let cursor = yashe.options.cursorHeight;
    expect(cursor==0.9).toBeTruthy();
});


test('disableCompleter', ()=>{
    yashe.disableCompleter('wikidata')
    expect(yashe.options.autocompleters.length==2).toBeTruthy();
});

test('enableCompleter', ()=>{
    yashe.enableCompleter('wikidata')
    expect(yashe.options.autocompleters.length==3).toBeTruthy();
});





//ExtraKeys
test('Default ExtraKeys', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys.length==13).toBeTruthy();
});
let key = 0;
test('Ctrl-Space', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Ctrl-Space').toBeTruthy();
});

test('Cmd-Space', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Cmd-Space').toBeTruthy();
});

test('Ctrl-/', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Ctrl-/').toBeTruthy();
});

test('Cmd-/', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Cmd-/').toBeTruthy();
});

test('Ctrl-Down', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Ctrl-Down').toBeTruthy();
});

test('Ctrl-Up', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Ctrl-Up').toBeTruthy();
});

test('Cmd-Down', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Cmd-Down').toBeTruthy();
});

test('Cmd-Up', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Cmd-Up').toBeTruthy();
});

test('Shift-Ctrl-F', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Shift-Ctrl-F').toBeTruthy();
});

test('Shift-Cmd-F', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Shift-Cmd-F').toBeTruthy();
});

test('Ctrl-S', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Ctrl-S').toBeTruthy();
});

test('F11', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='F11').toBeTruthy();
});

test('Esc', ()=>{
    let keys = Object.keys(yashe.options.extraKeys);
    expect(keys[key++]=='Esc').toBeTruthy();
});


test('Default Fullscreen', ()=>{
    let fullScreen = yashe.options.fullScreen;
    expect(fullScreen==false).toBeTruthy();
});

test('Default lineNumbers', ()=>{
    let lineNumbers = yashe.options.lineNumbers;
    expect(lineNumbers).toBeTruthy();
});

//Others
test('Default mode', ()=>{
    let mode = yashe.options.mode;
    expect(mode=='shex').toBeTruthy();
});

test('Default theme', ()=>{
    let theme = yashe.options.theme;
    expect(theme=='wiki').toBeTruthy();
});

test('Default value', ()=>{
    let value = yashe.options.value;
    let expected = "# Example 26  Simple ShEx Schema\n"+
          "# https://book.validatingrdf.com/bookHtml010.html#ch040%3AShExSimpleExample\n\n"+
          "PREFIX :       <http://example.org/>\n"+
          "PREFIX schema: <http://schema.org/>\n"+
          "PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#>\n\n"+
    
          ":User IRI {\n"+ 
          "  schema:name          xsd:string  ;\n"+
          "  schema:birthDate     xsd:date?  ;\n"+
          "  schema:gender        [ schema:Male schema:Female ] OR xsd:string ;\n"+
          "  schema:knows         IRI @:User* \n"+
          "}";

    expect(value==expected).toBeTruthy();
});


///API
test('hasErrors', ()=>{
    expect(!yashe.hasErrors()).toBeTruthy();
});

test('getDefinedPrefixes', ()=>{
    let keys = Object.keys(yashe.getDefinedPrefixes());
    expect(keys.length==3).toBeTruthy();
});

test('setCheckSyntaxErrors', ()=>{
    yashe.setCheckSyntaxErrors(false)
    expect(!yashe.options.syntaxErrorCheck).toBeTruthy();
    yashe.setCheckSyntaxErrors(true)
    expect(yashe.options.syntaxErrorCheck).toBeTruthy();
});


