# frozen_string_literal: true

# Hackathon projects: the meta, Open Graph and Twitter descriptions start with
# the award, the event, the university and the year
# ("Won Best Use of Knot API at HackPrinceton (Princeton University, 2025). …"),
# so a search result or a shared link shows them even when the project's own
# description doesn't. Every other page keeps jekyll-seo-tag's normal
# description. The wording comes from PortfolioSEO.award_text (seo_helpers.rb).
require "jekyll-seo-tag"

module Jekyll
  class SeoTag
    class Drop
      alias_method :portfolio_plain_description, :description

      def description
        @description ||= begin
          award_description = PortfolioSEO.seo_description(page)
          if award_description
            snippet(format_string(award_description), description_max_words)
          else
            portfolio_plain_description
          end
        end
      end
    end
  end
end
