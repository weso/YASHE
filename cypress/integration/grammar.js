const clearYashe = require('../utils/testUtils.js');
const $ = require('jquery');

describe('YASHE initialization',function() {
    it('Check YASHE exists',function() {
        cy.visit('http://localhost:4000/')
        expect(cy.get('.yashe')).to.exist  
    })
})

describe('Grammar',function() {

    it('RDFGrammar Book Examples',function() {
        cy.get('#rdfBookSelector').children()
        .each(($el, index, $list) => {
            if(!$el[0].disabled){
                cy.get('#rdfBookSelector').select($el[0].label)
                cy.window().then(win => {
                    expect(win.yashe.hasErrors()).to.be.false;         
                });
            }
        })
    })

// Wikidata shapes could contain errors
/*     it('Wikidata Examples',function() {
        cy.get('#wikiSelector').children()
        .each(($el, index, $list) => {
            if(!$el[0].disabled){
                cy.get('#wikiSelector').select($el[0].label)
                cy.window().then(win => {
                    expect(win.yashe.hasErrors()).to.be.false;         
                });
            }
        })
    }) */

    it('Other Examples',function() {
        cy.get('#othersSelector').children()
        .each(($el, index, $list) => {
            if(!$el[0].disabled){
                cy.get('#othersSelector').select($el[0].label)
                cy.window().then(win => {
                    expect(win.yashe.hasErrors()).to.be.false;         
                });
            }
        })
    })

})