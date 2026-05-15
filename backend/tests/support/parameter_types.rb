require 'json'

ParameterType(
  name: 'markers',
  regexp: /\[.*\]/,
  transformer: ->(markers) {
    markers.gsub(/[\[\]\s']/, '').split(',')
  }
)