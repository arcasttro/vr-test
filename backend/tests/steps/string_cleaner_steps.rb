require_relative '../../utils/string_cleaner'


Given ('the input string is {string}') do | string |
    @string = string
end

And  ('then markers are {markers}') do | markers |
    @markers = markers
end

Then ('the expected result is: {string}') do | result |
    data = StringCleaner.new(@string, @markers)
    expect(data.get_cleaner_string).to eql(result)
end