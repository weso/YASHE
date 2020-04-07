describe('YASHE initialization',function() {
    it('Check YASHE exists',function() {
        cy.visit('http://localhost:4000/')
        expect(cy.get('.yashe')).to.exist  
    })
})

describe('Wikibase',function() {
    
    it('Check wikibase entity autocompleter works with the wikidata instance',function() {
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

    it('Check wikibase entity autocompleter works with another wikibase instance',function() {
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


})


function clearYashe(){
    cy.window().then(win => {
        win.yashe.setValue("");       
    });
}