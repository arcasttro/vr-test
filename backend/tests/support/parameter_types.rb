require 'json'

ParameterType(
  name: 'markers',
  regexp: /\[.*\]/,  #And then markers are ['#', '!'] => regexp pega apenas o que está entre colchetes ['#', '!']
  transformer: ->(markers) {
    markers.gsub(/[\[\]\s']/, '').split(',') #string sanitization, removendo [, espaços em branco e '. retorna um array
  }
)