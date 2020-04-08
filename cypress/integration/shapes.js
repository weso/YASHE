const shapeColor = 'rgb(15, 122, 80)';
const clearYashe = require('../utils/testUtils.js')

describe('YASHE initialization',function() {
    it('Check YASHE exists',function() {
        cy.visit('http://localhost:4000/')
        expect(cy.get('.yashe')).to.exist  
    })
})

describe('Shapes',function() {
    
    it('Type a Shape and check Defined Shapes',function() {
        clearYashe()
        cy.get('.CodeMirror textarea')
        // we use `force: true` below because the textarea is hidden
        // and by default Cypress won't interact with hidden elements
        .type('PREFIX : <https://wwww.example.org>\n\n:User', { force: true });
    })

    it('Shape class exist after typing a Shape',function() {
        clearYashe()
        cy.get('.cm-shape').should('not.exist');

        cy.get('.CodeMirror textarea')
        .type('PREFIX : <https://wwww.example.org>\n\n:User', { force: true });

        cy.get('.cm-shape').should('exist');
    
    })

    it('Shape color is OK',function() {
        cy.get('.cm-shape').should('have.css', 'color', shapeColor);
    })
})
