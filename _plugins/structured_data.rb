# frozen_string_literal: true

require "json"
require_relative "seo_helpers"

# {% structured_data %} — one JSON-LD @graph per page, used by head.html.
#
# Every page carries the same full description of Mami (Person, with a fixed
# @id), the WebSite, and a node for the page itself: ProfilePage on About,
# CreativeWork for a project, BlogPosting for a post, VisualArtwork for a piece
# of art, CollectionPage (with the list of items) for index, category, tag and
# year pages. Search engines and AI assistants read this to understand who the
# site is about and how every project, post and picture connects back to Mami.
module PortfolioSEO
  class StructuredDataTag < Liquid::Tag
    def render(context)
      site = context.registers[:site]
      page = context.registers[:page] || {}
      url = page["url"].to_s
      return "" if url == "/404.html"

      graph = [website(site), person(site)]
      graph.concat(page_nodes(site, page, url))
      json = JSON.pretty_generate({ "@context" => "https://schema.org", "@graph" => graph })
      %(<script type="application/ld+json">\n#{json.gsub('</', '<\/')}\n</script>)
    end

    private

    def website(site)
      {
        "@type" => "WebSite",
        "@id" => PortfolioSEO.website_id(site),
        "url" => "#{PortfolioSEO.base(site)}/",
        "name" => site.config["title"],
        "alternateName" => ["Mami Ravaloarison", "mravaloarison"],
        "description" => site.config["description"].to_s.strip,
        "inLanguage" => site.config["lang"] || "en-US",
        "author" => PortfolioSEO.person_ref(site),
        "publisher" => PortfolioSEO.person_ref(site),
      }
    end

    def person(site)
      about = PortfolioSEO.about(site)
      prof = PortfolioSEO.profile(site)
      name = prof["full_name"] || site.config.dig("author", "name")
      photo = PortfolioSEO.photos(site).first

      node = {
        "@type" => "Person",
        "@id" => PortfolioSEO.person_id(site),
        "name" => name,
        "alternateName" => Array(prof["also_known_as"]),
        "givenName" => prof["given_name"],
        "familyName" => prof["family_name"],
        "description" => PortfolioSEO.plain(about["headline"]),
        "disambiguatingDescription" => prof["one_liner"],
        "url" => "#{PortfolioSEO.base(site)}/",
        "mainEntityOfPage" => "#{PortfolioSEO.base(site)}/",
        "email" => "mailto:#{site.config.dig('author', 'email')}",
        "jobTitle" => Array(prof["job_titles"]),
        "worksFor" => org(prof["works_for"]),
        "homeLocation" => place(prof["home_location"]),
        "nationality" => prof["from_country"] && { "@type" => "Country", "name" => prof["from_country"] },
        "alumniOf" => Array(about["education"]).map do |e|
          { "@type" => "EducationalOrganization", "name" => e["institution"], "url" => e["url"] }.compact
        end,
        "hasCredential" => credentials(about),
        "knowsLanguage" => Array(about["languages"]).map { |l| l["name"] },
        "knowsAbout" => PortfolioSEO.knows_about(site),
        "award" => awards(site, about),
        "seeks" => about["looking_for"].to_s.empty? ? nil : { "@type" => "Demand", "description" => PortfolioSEO.plain(about["looking_for"].gsub("%email%", site.config.dig("author", "email").to_s)) },
        "sameAs" => Array(site.config.dig("social", "links")),
      }
      node["image"] = PortfolioSEO.image_object(site, photo["src"], photo["alt"]) if photo
      node.reject { |_, v| v.nil? || (v.respond_to?(:empty?) && v.empty?) }
    end

    def org(hash)
      return nil unless hash

      o = { "@type" => "Organization", "name" => hash["name"], "url" => hash["url"] }
      o["department"] = { "@type" => "Organization", "name" => hash["department"] } if hash["department"]
      o.compact
    end

    def place(name)
      name && { "@type" => "Place", "name" => name }
    end

    def credentials(about)
      Array(about["certificates"]).map do |c|
        {
          "@type" => "EducationalOccupationalCredential",
          "name" => c["name"],
          "credentialCategory" => "certificate",
          "recognizedBy" => { "@type" => "Organization", "name" => c["issuer"] },
          "dateCreated" => c["date"].to_s,
        }
      end
    end

    def awards(site, about)
      list = Array(about["awards"]).map { |a| "#{a['title']} (#{a['awarder']}, #{a['date']})" }
      list + PortfolioSEO.project_awards(site).map do |d|
        "#{PortfolioSEO.award_text(d.data)}, for #{d.data['title']}"
      end
    end

    def webpage(site, page, url, type = "WebPage")
      {
        "@type" => type,
        "@id" => "#{PortfolioSEO.abs(site, url)}#webpage",
        "url" => PortfolioSEO.abs(site, url),
        "name" => page["title"],
        "description" => page["description"],
        "inLanguage" => site.config["lang"] || "en-US",
        "isPartOf" => { "@id" => PortfolioSEO.website_id(site) },
        "author" => PortfolioSEO.person_ref(site),
        "about" => PortfolioSEO.person_ref(site),
      }.compact
    end

    def page_nodes(site, page, url)
      collection = page["collection"]
      if url == "/" || url == "/bio/"
        # Both About pages (short and long bio) are "About Me" profile pages.
        # Google wants the person itself, with a name, inside mainEntity.
        node = webpage(site, page, url, "ProfilePage")
        node["mainEntity"] = profile_entity(site)
        node["dateModified"] = site.time.iso8601
        [node]
      elsif collection == "projects"
        project_nodes(site, page, url)
      elsif collection == "arts"
        art_nodes(site, page, url)
      elsif collection == "posts"
        post_nodes(site, page, url)
      elsif (items = listed_items(site, page, url))
        collection_nodes(site, page, url, items)
      else
        [webpage(site, page, url)]
      end
    end

    # The Person for a ProfilePage: the required name plus the recommended
    # alternateName, description, sameAs and image (when there's a photo).
    def profile_entity(site)
      prof = PortfolioSEO.profile(site)
      photo = PortfolioSEO.photos(site).first
      PortfolioSEO.person_ref(site).merge(
        "alternateName" => Array(prof["also_known_as"]).first,
        "description" => PortfolioSEO.plain(PortfolioSEO.about(site)["headline"]),
        "sameAs" => Array(site.config.dig("social", "links")),
        "image" => photo && PortfolioSEO.abs(site, photo["src"]),
      ).compact
    end

    def item_ref(site, doc)
      "#{PortfolioSEO.abs(site, doc.url)}#item"
    end

    def project_nodes(site, page, url)
      links = page["links"] || {}
      work = {
        "@type" => "CreativeWork",
        "@id" => "#{PortfolioSEO.abs(site, url)}#item",
        "name" => page["title"],
        "headline" => page["title"],
        "description" => page["description"],
        "url" => PortfolioSEO.abs(site, url),
        "mainEntityOfPage" => "#{PortfolioSEO.abs(site, url)}#webpage",
        "author" => PortfolioSEO.person_ref(site),
        "creator" => PortfolioSEO.person_ref(site),
        "datePublished" => PortfolioSEO.date_iso(page["date"]),
        "genre" => page["category"] == "Hackathon" ? "Hackathon project" : "#{page['category']} project",
        "keywords" => Array(page["tech"]).join(", "),
        "image" => PortfolioSEO.image_object(site, page["image"], page["image_alt"]),
        "award" => PortfolioSEO.award_text(page),
        "creativeWorkStatus" => page["status"] == "ongoing" ? "In progress" : nil,
        "sameAs" => links.values.compact.reject(&:empty?),
        "isPartOf" => { "@id" => "#{PortfolioSEO.abs(site, '/projects/')}#webpage" },
      }
      if page["organization"] || page["event"]
        work["contentLocation"] = { "@type" => "Place", "name" => [page["event"], page["organization"]].compact.join(", ") }
      end
      wp = webpage(site, page, url, "ItemPage")
      # same description as the meta tag: award, university and year first
      wp["description"] = PortfolioSEO.seo_description(page) || page["description"]
      wp["mainEntity"] = { "@id" => work["@id"] }
      wp["primaryImageOfPage"] = work["image"]
      [wp, work.reject { |_, v| v.nil? || (v.respond_to?(:empty?) && v.empty?) }]
    end

    def art_nodes(site, page, url)
      art = {
        "@type" => "VisualArtwork",
        "@id" => "#{PortfolioSEO.abs(site, url)}#item",
        "name" => page["title"],
        "description" => page["description"],
        "url" => PortfolioSEO.abs(site, url),
        "mainEntityOfPage" => "#{PortfolioSEO.abs(site, url)}#webpage",
        "creator" => PortfolioSEO.person_ref(site),
        "author" => PortfolioSEO.person_ref(site),
        "artMedium" => page["medium"] == "Procreate" ? "Digital painting (Procreate)" : page["medium"],
        "artform" => page["medium"] == "Sketchbook" ? "Sketch" : "Drawing",
        "dateCreated" => PortfolioSEO.date_iso(page["date"]),
        "keywords" => Array(page["tools"]).join(", "),
        "image" => PortfolioSEO.image_object(site, page["image"], page["image_alt"]),
      }
      wp = webpage(site, page, url, "ItemPage")
      wp["mainEntity"] = { "@id" => art["@id"] }
      wp["primaryImageOfPage"] = art["image"]
      [wp, art.reject { |_, v| v.nil? || (v.respond_to?(:empty?) && v.empty?) }]
    end

    def post_nodes(site, page, url)
      text = page["content"].to_s.gsub(/<[^>]+>/, " ")
      post = {
        "@type" => "BlogPosting",
        "@id" => "#{PortfolioSEO.abs(site, url)}#item",
        "headline" => page["title"],
        "description" => page["description"],
        "url" => PortfolioSEO.abs(site, url),
        "mainEntityOfPage" => "#{PortfolioSEO.abs(site, url)}#webpage",
        "author" => PortfolioSEO.person_ref(site),
        "publisher" => PortfolioSEO.person_ref(site),
        "datePublished" => PortfolioSEO.date_iso(page["date"]),
        "dateModified" => PortfolioSEO.date_iso(page["last_modified_at"] || page["date"]),
        "keywords" => Array(page["tags"]).join(", "),
        "wordCount" => text.split.size,
        "inLanguage" => site.config["lang"] || "en-US",
        "image" => PortfolioSEO.image_object(site, page["image"], page["image_alt"] || page["title"]),
        "isPartOf" => { "@id" => "#{PortfolioSEO.abs(site, '/blog/')}#webpage" },
      }
      wp = webpage(site, page, url)
      wp["mainEntity"] = { "@id" => post["@id"] }
      [wp, post.reject { |_, v| v.nil? || (v.respond_to?(:empty?) && v.empty?) }]
    end

    # Which items an index / category / tag / year page lists, or nil if none.
    def listed_items(site, page, url)
      cats = Array(site.data.dig("categories", "projects"))
      case url
      when "/projects/" then PortfolioSEO.projects(site).sort_by { |d| d.data["date"].to_s }.reverse
      when %r{\A/projects/category/([^/]+)/\z}
        cat = cats.find { |c| c["slug"] == Regexp.last_match(1) }
        cat && PortfolioSEO.projects(site).select { |d| d.data["category"] == cat["name"] }
      when "/blog/" then PortfolioSEO.posts(site)
      when %r{\A/blog/(\d{4})/\z}
        year = Regexp.last_match(1)
        PortfolioSEO.posts(site).select { |d| d.date.year.to_s == year }
      when %r{\A/blog/tag/[^/]+/\z}
        PortfolioSEO.posts(site).select { |d| Array(d.data["tags"]).include?(page["tag"]) }
      when "/arts/" then PortfolioSEO.arts(site)
      when %r{\A/arts/medium/[^/]+/\z}
        PortfolioSEO.arts(site).select { |d| d.data["medium"] == page["medium_name"] }
      end
    end

    def collection_nodes(site, page, url, items)
      wp = webpage(site, page, url, "CollectionPage")
      wp["mainEntity"] = {
        "@type" => "ItemList",
        "numberOfItems" => items.size,
        "itemListElement" => items.each_with_index.map do |d, i|
          {
            "@type" => "ListItem",
            "position" => i + 1,
            "url" => PortfolioSEO.abs(site, d.url),
            "name" => d.data["title"],
          }
        end,
      }
      [wp]
    end
  end
end

Liquid::Template.register_tag("structured_data", PortfolioSEO::StructuredDataTag)
