describe('Shapes',function() {
    
    it('YASHE initialization',function() {
        cy.visit('http://localhost:4000/')
        expect(cy.get('.yashe')).to.exist  
    })
    
    it('Type a Shape and check Defined Shapes',function() {
        clearYashe()
        cy.get('.CodeMirror textarea')
        // we use `force: true` below because the textarea is hidden
        // and by default Cypress won't interact with hidden elements
        .type('PREFIX : <https://wwww.example.org>\n\n:User', { force: true });

        
      
    })
})


function clearYashe(){
    cy.window().then(win => {
        win.yashe.setValue("");       
    });
}
