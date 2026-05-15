class StringCleaner
    def initialize(string, split_pattern)
        @string = string
        @split_pattern = split_pattern
    end

    def check_string
        @string.is_a?(String) && !@string.empty?
    end

    def check_split_pattern
        @split_pattern.is_a?(Array) && !@split_pattern.empty?
    end

    def get_cleaner_string
        return "Invalid Inputs" unless check_string && check_split_pattern
            @string.split(Regexp.union(@split_pattern)).first.strip
    end
end