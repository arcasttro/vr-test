require 'dotenv/load'
require 'json'

require_relative 'endpoints'
require_relative 'base_service'


class VrpatService < BaseService #criaria um metodo para cara verbo http. 
    def get_service
        if ENV['API_ENV'] == 'MOCK'
            JSON.parse(File.read(File.join(__dir__, '../mocks/VRPAT_RESPONSE.json'))) #__dir__ para nao dar erro ao executar fora da minha maquina.
        else
            self.class.get(Endpoints::VR_PAT).parsed_response #para evitar hardcoded, preferi ja modularizar os endpoints. como estou utilizando mock, fixei para tanto prod/mock retornarem hashs
        end
    end 
end
