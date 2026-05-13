require_relative '../../services/vrpat_service'

Given('that I made a GET request to the VRPAT endpoint') do
    @response = VrpatService.new.get_service
end

Then('so the response must have a typeOfEstablishment key') do
    expect(@response).to have_key('typeOfEstablishment')
    @establishment = @response['typeOfEstablishment']
end

And('a random establishment type is printed') do
    puts @establishment.sample
end
