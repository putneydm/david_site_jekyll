# A Liquid tag for random number generation
# Usage: {% random min:max %} where min and max are integers and min < max

module Jekyll
    class Random < Liquid::Tag

        def initialize(tag_name, range, tokens)
            super
            limits = range.split(":")
            @min = limits[0].to_i
            @max = limits[1].to_i
        end

        def render(context)
            (@min + rand(@max - @min)).to_s
        end
    end
end

Liquid::Template.register_tag('random', Jekyll::Random)
