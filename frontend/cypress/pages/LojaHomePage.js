export class LojaHomePage {
    
    getBotaoSoluçõesVR(){
        return cy.get('#btn-selecionar-0')
    }

    clickBotaoSoluçõesVR(){
        this.getBotaoSoluçõesVR()
            .should('be.visible')
            .click()
    }
}
