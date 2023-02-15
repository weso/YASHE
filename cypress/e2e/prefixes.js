const keywordColor = 'rgb(255, 0, 0)';
const prefixesColor = 'rgb(109, 15, 122)';
const clearYashe = require('../utils/testUtils.js')

/*
describe('YASHE initialization',function() {
    it('Check YASHE exists',function() {
        cy.visit('http://localhost:4000/')
        expect(cy.get('.yashe')).to.exist
    })
})
*/

describe('Prefixes',function() {
    
    it('Type a prefix and check the defined prefixes of yashe',function() {
        cy.visit('http://localhost:4000/')
        //clearYashe()
        cy.window().then(win => {
            win.yashe.setValue("")
          })
    
        /*
        cy.get('.CodeMirror textarea')
        // we use `force: true` below because the textarea is hidden
        // and by default Cypress won't interact with hidden elements
        .type('PREFIX : <https://wwww.example.org>', { force: true });

        cy.window().then(win => {
            let predfixes = win.yashe.getDefinedPrefixes();
            expect(Object.keys(predfixes).length).to.equals(1);  
        });*/
      
    }) 

    it('Prefixes classes exist after typing a prefix',function() {

        clearYashe()

        cy.get('.cm-keyword').should('not.exist');
        cy.get('.cm-prefixDelcIRI').should('not.exist');
        cy.get('.cm-prefixDelcAlias').should('not.exist');

        cy.get('.CodeMirror textarea')
        .type('PREFIX : <https://wwww.example.org>', { force: true });

        cy.get('.cm-keyword').should('exist');
        cy.get('.cm-prefixDelcIRI').should('exist');
        cy.get('.cm-prefixDelcAlias').should('exist');
    })

    it('Prefixes colors are OK',function() {
        cy.get('.cm-keyword').should('have.css', 'color', keywordColor);
        cy.get('.cm-prefixDelcIRI').should('have.css', 'color', prefixesColor);
        cy.get('.cm-prefixDelcAlias').should('have.css', 'color', prefixesColor);
    }) 

    it('Prefixes autocompleter trigger works',function() {
        cy.get('.CodeMirror-hints').should('not.exist');
        clearYashe();
        cy.get('.CodeMirror textarea')
        .type('PREFIX wd', { force: true })
        cy.get('.CodeMirror-hints').should('exist');
    })

    it('Select a prefix option from the prefix autocompleter hints',function() {
        cy.get('.CodeMirror-hints').children().first().click();
        cy.window().then(win => {
            expect(win.yashe.getValue()).to.equals('PREFIX wd: <http://www.wikidata.org/entity/>');         
        });
        cy.get('.CodeMirror-hints').should('not.exist');
    })

    it('Defined prefix autocompleter works',function() {
        cy.get('.CodeMirror-hints').should('not.exist');
        cy.get('.CodeMirror textarea')
        .type('\nw{ctrl}{ }',{ force: true })
        cy.get('.CodeMirror-hints').should('exist');
        cy.get('.CodeMirror-hints').children().first().click();
        cy.window().then(win => {
            expect(win.yashe.getValue()).to.equals('PREFIX wd: <http://www.wikidata.org/entity/>\nwd:');         
        });
        cy.get('.CodeMirror-hints').should('not.exist');

    })

    it('Prefix not defined error',function() {
        clearYashe();
        cy.get('.parseErrorIcon').should('not.exist');
        
        cy.get('.CodeMirror textarea')
        .type('wd:', { force: true })

        cy.get('.parseErrorIcon').should('exist');
        
        cy.get('.yashe_tooltip').should('not.exist');
        cy.get('.parseErrorIcon').click();
        cy.get('.yashe_tooltip').should('exist');
        cy.get('.yashe_tooltip').should('have.text',"Prefix 'wd' is not defined");
    })  

   
})