const clearYashe = require('../utils/testUtils.js')

describe('YASHE initialization',function() {
    it('Check YASHE exists',function() {
        cy.visit('http://localhost:4000/')
        expect(cy.get('.yashe')).to.exist  
    })
})

describe('Wikibase',function() {
    
    it('Entity autocompleter works with the wikidata instance',function() {
        clearYashe();
        
        cy.get('.CodeMirror-hints').should('not.exist');
        //Activate the autcompleter
        cy.get('.CodeMirror textarea')
        // we use `force: true` below because the textarea is hidden
        // and by default Cypress won't interact with hidden elements
        .type('PREFIX wd: <http://www.wikidata.org/entity/> \nwd:{ctrl}{ }', { force: true });
        cy.get('.CodeMirror-hints').should('exist');
        cy.get('.CodeMirror-hints').should('have.text',"Type to search for an entity");

        //Type some entity to search and click the first one
        cy.get('.CodeMirror textarea')
        .type('universe', { force: true });
       
        cy.wait(500)
        cy.get('.CodeMirror-hints').children().first().click();
        
        cy.window().then(win => {
            expect(win.yashe.getValue()).to.equals("PREFIX wd: <http://www.wikidata.org/entity/> \nwd:Q1");       
        });
    })

    it('Property autocompleter works with the wikidata instance',function() {
        clearYashe();
        
        cy.get('.CodeMirror-hints').should('not.exist');
        //Activate the autcompleter
        cy.get('.CodeMirror textarea')
        // we use `force: true` below because the textarea is hidden
        // and by default Cypress won't interact with hidden elements
        .type('PREFIX p: <http://www.wikidata.org/prop/> \np:{ctrl}{ }', { force: true });
        cy.get('.CodeMirror-hints').should('exist');
        cy.get('.CodeMirror-hints').should('have.text',"Type to search for an entity");

        //Type some entity to search and click the first one
        cy.get('.CodeMirror textarea')
        .type('instance', { force: true });
       
        cy.wait(500)
        cy.get('.CodeMirror-hints').children().first().click();
        
        cy.window().then(win => {
            expect(win.yashe.getValue()).to.equals("PREFIX p: <http://www.wikidata.org/prop/> \np:P31");       
        });
    })  

    it('Entity autocompleter works with another wikibase instance',function() {
        clearYashe();
        
        cy.get('.CodeMirror-hints').should('not.exist');
        //Activate the autcompleter
        cy.get('.CodeMirror textarea')
        .type('PREFIX labra: <https://cursoslabra.wiki.opencura.com/wiki/Item:> \nlabra:{ctrl}{ }', { force: true });
        cy.get('.CodeMirror-hints').should('exist');
        cy.get('.CodeMirror-hints').should('have.text',"Type to search for an entity");

        //Type some entity to search and click the first one
        cy.get('.CodeMirror textarea')
        .type('person', { force: true });
       
        cy.wait(500)
        cy.get('.CodeMirror-hints').children().first().click();
        
        cy.window().then(win => {
            expect(win.yashe.getValue()).to.equals("PREFIX labra: <https://cursoslabra.wiki.opencura.com/wiki/Item:> \nlabra:Q1");       
        });
    })


    it('Entity autocompleter works with another wikibase instance (special case)',function() {
        // I've found that at least one wikibase instance (https://wiki.eagle-network.eu/wiki/Main_Page)
        // have one small diference in the API call 
        
        clearYashe();
        
        cy.get('.CodeMirror-hints').should('not.exist');
        //Activate the autcompleter
        cy.get('.CodeMirror textarea')
        .type('PREFIX eagle: <https://wiki.eagle-network.eu/wiki/Item:> \neagle:{ctrl}{ }', { force: true });
        cy.get('.CodeMirror-hints').should('exist');
        cy.get('.CodeMirror-hints').should('have.text',"Type to search for an entity");

        //Type some entity to search and click the first one
        cy.get('.CodeMirror textarea')
        .type('q', { force: true });
       
        cy.wait(700)
        cy.get('.CodeMirror-hints').children().first().click();
        
        cy.window().then(win => {
            expect(win.yashe.getValue()).to.equals("PREFIX eagle: <https://wiki.eagle-network.eu/wiki/Item:> \neagle:Q5493");       
        });
    }) 


})


