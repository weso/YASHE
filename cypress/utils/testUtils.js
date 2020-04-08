module.exports = function clearYashe(){
    cy.window().then(win => {
        win.yashe.setValue("");       
    });
}