const clearYashe = require('../utils/testUtils.js');
const $ = require('jquery');

describe('YASHE initialization',function() {
    it('Check YASHE exists',function() {
        cy.visit('http://localhost:4000/')
        expect(cy.get('.yashe')).to.exist  
    })
})

describe('Buttons',function() {
    
    it('Buttons exists',function() {
        cy.get('.yashe_buttons').should('exist');
    })

})