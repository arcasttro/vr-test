export class CarrinhoBeneficiosPage {
    getBotaoAdicionarProdutoAuto(){
        return cy.get('[data-testid="adicionar-produto-28"]')
    }

    getRemoverProdutoAuto(){
        return cy.get('#remover-produto-28')
    }
    
    clickRemoverProdutoAuto(){
        this.getRemoverProdutoAuto()
            .scrollIntoView()
            .should('be.visible')
            .click()
    }

    clickBotaoAdicionarProdutoAuto(){
        this.getBotaoAdicionarProdutoAuto()
            .scrollIntoView()
            .should('be.visible')
            .click()
    }

    getAdicionarQntProdutoAuto(){
        return cy.get('#remover-produto-28')
                .parent()
                .find('button.plus-button')
    }

    clickAdicionarQntProdutoAuto(){
        this.getAdicionarQntProdutoAuto()
            .scrollIntoView()
            .should('be.visible')
            .click()
    }
    
    getTotalAdicionadoProdutoAuto(){
        return cy.get('#produto-auto-quantidade')
    }

    getCampoValorProdutoAuto(){
        return cy.get('#produto-auto-valor')
    }

    getBotaoSeguirCarrinho(){
        return cy.get('#carrinho-seguir-para-a-compra')
    }

    clickBotaoSeguirCarrinho(){
        this.getBotaoSeguirCarrinho()
            .should('be.visible')
            .click()
    }

    getValorTotalCarrinho(){
        return this.getBotaoSeguirCarrinho()
            .parent()
            .find('.order-summary-total-value')
            .invoke('text')
    }

    getQuantidadeCarrinho() {
        return this.getBotaoSeguirCarrinho()
        .parent()
        .parent()
        .contains('p', 'Quantidade')
        .siblings('p')
        .invoke('text')
        .then((text) => {
            return parseInt(text.replace('x', ''))
        })
}

}