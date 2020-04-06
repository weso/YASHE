const constraintKeywordColor = 'rgb(255, 0, 0)';
const prefixesColor = 'rgb(109, 15, 122)';

describe('YASHE initialization',function() {
    it('Check YASHE exists',function() {
        cy.visit('http://www.weso.es/YASHE/')
        expect(cy.get('.yashe')).to.exist  
    })
})

describe('Prefixes',function() {
    it('Type a prefix and check the defined prefixes of yashe',function() {
        cy.window().then(win => {
            win.yashe.setValue("");       
        })

        cy.get('.CodeMirror textarea')
        // we use `force: true` below because the textarea is hidden
        // and by default Cypress won't interact with hidden elements
        .type('PREFIX : <https://wwww.example.org>', { force: true })

         cy.window().then(win => {
            let predfixes = win.yashe.getDefinedPrefixes();
            expect(Object.keys(predfixes).length).to.equals(1);  
        })
      
    }) 

    it('Check the prefixes colors are OK',function() {
        expect(cy.get('.cm-keyword')).to.exist
        cy.get('.cm-keyword').should('have.css', 'color', constraintKeywordColor)
        expect(cy.get('.cm-prefixDelcIRI')).to.exist
        cy.get('.cm-prefixDelcIRI').should('have.css', 'color', prefixesColor)
        expect(cy.get('.cm-prefixDelcAlias')).to.exist
        cy.get('.cm-prefixDelcAlias').should('have.css', 'color', prefixesColor)
        
    })
})


/* describe('My First Test',function() {
    it('Get prefixes hints',function() {
       // cy.visit('http://www.weso.es/YASHE/')
         cy.window().then(win => {
            win.yashe.setValue("");
            console.log(win.yashe.getDefinedPrefixes());
        })

        cy.get('.CodeMirror textarea')
        // we use `force: true` below because the textarea is hidden
        // and by default Cypress won't interact with hidden elements
        .type('PREFIX : <https://wwww.example.org> \n PREFIX wd', { force: true })

        expect(cy.get('.CodeMirror-hints')).to.exist  
    
        cy.window().then(win => {
            console.log(win.yashe.getDefinedPrefixes());
        })
 
    })
    
})
 */


/*

 cy.visit('http://www.weso.es/YASHE')
        cy.get('.yashe').click()*/