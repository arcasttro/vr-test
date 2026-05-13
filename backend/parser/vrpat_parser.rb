# escolhi criar um parser para evitar que acumulo acumulo de responsabilidade. a pasta service se encarreca excluisvamente da comunicaçao com api
# e steps com pouca ou nenhuma logica para facilitar leitura


# aqui criei metodos para acessar e manipular o JSON, que irei usar nos steps.
# como tenho um metodo que chama o establishment, preferi colocar um fallback para evitar erro.
class VrpatParser
    def initialize(response)
        @body = response.parsed_response
    end

    def has_establishment?
        @body.key?('typeOfEstablishment')
    end

    def establishment
        @body.['typeOfEstablishment'] || []

    def sorted_establishment
        establishment.sample
    end

end
    