import { 
    LojaHomePage,
    CarrinhoBeneficiosPage
} from '../pages'

const lojaHomePage = new LojaHomePage()
const carrinhoBeneficiosPage = new CarrinhoBeneficiosPage()

describe('Carrinho - Adicionando VR Auto ao carrinho', () => {

    beforeEach(() => {

        // Interceptando as APIs antes de acessar a página para garantir que as requisições sejam capturadas desde o início
        // além disso, evita flakys e possibilita validações de response
        cy.intercept({ method: 'GET', pathname: '**/modalidades-loja' }).as('getModalidadesLoja')
        cy.intercept({ method: 'GET', pathname: '**/produtos-loja' }).as('getProdutosLoja')
        cy.intercept({ method: 'POST', pathname: '**/precificacoes/consultas' }).as('postPrecificacao')

        cy.visit('/')
        cy.wait('@getModalidadesLoja').its('response.statusCode').should('eq', 200)
        cy.wait('@getProdutosLoja').its('response.statusCode').should('eq', 200)

        lojaHomePage.clickBotaoSoluçõesVR()
    })

    it('deve adicionar VR Auto no carrinho, com quantidade e valores aleatórios', () => {
        const quantity = Math.floor(Math.random() * 998) + 1      //algum valor dentro da mesma partição
        const creditValue = Math.floor(Math.random() * 9899) + 100 // algum valor dentro da mesma partição

        carrinhoBeneficiosPage.clickBotaoAdicionarProdutoAuto()

        carrinhoBeneficiosPage.clickAdicionarQntProdutoAuto()

        carrinhoBeneficiosPage.getTotalAdicionadoProdutoAuto().invoke('val').should('eq', '1') // valida adição de qnt pelo botão

        carrinhoBeneficiosPage.getTotalAdicionadoProdutoAuto().clear().type(quantity - 1)

        carrinhoBeneficiosPage.getCampoValorProdutoAuto().type(creditValue)

        cy.wait('@postPrecificacao')
            .then((data) => {
                const body = data.response.body
                expect(data.response.statusCode).to.eq(200)

                carrinhoBeneficiosPage.getQuantidadeCarrinho().should('eq', quantity - 1)

                carrinhoBeneficiosPage.getValorTotalCarrinho()
                .should('eq', body.result.resumo.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })) //valida o calculo da api
            })


        carrinhoBeneficiosPage.getBotaoSeguirCarrinho()
            .should('be.visible')
            .and('not.be.disabled')
        
        carrinhoBeneficiosPage.clickBotaoSeguirCarrinho()
        cy.screenshot('Produto Adicionado ao Carrinho')
    })

    it('botão "Seguir com a contratação" deve manter desabilitado quando valor mensal < R$ 1,00', () => {
        carrinhoBeneficiosPage.clickBotaoAdicionarProdutoAuto()
        
        carrinhoBeneficiosPage.getTotalAdicionadoProdutoAuto().clear().type(3)

        carrinhoBeneficiosPage.getCampoValorProdutoAuto().type(11) //o input possui mascara. result R$ 0,11
            .parent()
            .should('have.attr', 'class')
            .and('include', 'hasError-true')

        carrinhoBeneficiosPage.getBotaoSeguirCarrinho()
            .should('be.disabled')

        cy.screenshot('Botão "Seguir com a contratação" desabilitado quando valor mensal inválido')
    })

    // Cenário do EP: A máscara do input impede digitação — comportamento validado manualmente
    it.skip('botão "Seguir com a contratação" deve manter desabilitado quando valor mensal > R$ 9.999,99', () => {
    })

    it('botão "Seguir com a contratação" deve manter desabilitado quando quantidade < 1', () => {
        
        carrinhoBeneficiosPage.clickBotaoAdicionarProdutoAuto()
        
        carrinhoBeneficiosPage.getTotalAdicionadoProdutoAuto().clear().type(0)
            .parent()
            .should('have.attr', 'class')
            .and('include', 'hasError-true')

        carrinhoBeneficiosPage.getCampoValorProdutoAuto().type(500)

        carrinhoBeneficiosPage.getBotaoSeguirCarrinho()
            .should('be.disabled')

        cy.screenshot('Botão "Seguir com a contratação" desabilitado quando quantidade inválido')

    })

    it('deve remover o produto Auto do carrinho ao clicar no botão "Lixeira"', () => {

        carrinhoBeneficiosPage.clickBotaoAdicionarProdutoAuto()
        
        carrinhoBeneficiosPage.getTotalAdicionadoProdutoAuto().clear().type(2)

        carrinhoBeneficiosPage.getCampoValorProdutoAuto().type(500)

        carrinhoBeneficiosPage.clickRemoverProdutoAuto()

        carrinhoBeneficiosPage.getRemoverProdutoAuto().should('not.exist')

        cy.screenshot('Produto Auto removido')


    })

})
// https://api.vr.com.br/bff-loja-vr-compre/v1/empresas/89374190000110/tipo?cpf=14404864680&emailAcesso=arcastroqa@gmail.com&codigosProdutosSelecionados=28  estou recebendo 504 error nesse endpoint, com isso, nao consigo avançar no fluxo.