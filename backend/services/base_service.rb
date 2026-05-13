require 'dotenv/load'
require 'httparty'

class BaseService #Apesar de exagerado, ja separei um service para configuração de BASE de requisição (headers, base_uri, etc.)
    include HTTParty
    
    base_uri ENV['BASE_URL'] #além de boa pratica, criei um .env para mudar ambiente prd e mock

    headers 'Content-type' => 'application/json'
end