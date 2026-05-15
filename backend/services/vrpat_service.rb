require 'dotenv/load'
require 'json'

require_relative 'endpoints'
require_relative 'base_service'

ServiceTemplate = Struct.new(:status, :body) #padronizei a estrutura de dados que o service envia para os steps para que os asserts funcionem no mock/prod

class VrpatService < BaseService #criaria um metodo para cada verbo http. 
    def get_service
        if ENV['API_ENV'] == 'MOCK'
            mock_response = JSON.parse(File.read(File.join(__dir__, '../mocks/VRPAT_RESPONSE.json'))) #__dir__ para nao dar erro ao executar fora da minha maquina.
            ServiceTemplate.new(200, mock_response)
        else
            response = self.class.get(Endpoints::VR_PAT) #para evitar hardcoded, preferi ja modularizar os endpoints.
            ServiceTemplate.new(response.code, response.parsed_response)
        end
    end 
end
