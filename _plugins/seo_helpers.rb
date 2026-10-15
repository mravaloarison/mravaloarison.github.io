# frozen_string_literal: true

# Shared helpers for the SEO plugins in this folder (structured data, sitemap,
# llms.txt). Everything is derived from what's already on the site:
# _data/about.yml, the projects / arts / posts collections, _data/photos.yml
# and _data/image_dimensions.yml. Nothing here needs editing when content changes.
module PortfolioSEO
  module_function

  def base(site)
    "#{site.config['url']}#{site.config['baseurl']}".chomp("/")
  end

  def abs(site, path)
    return nil if path.nil? || path.to_s.empty?
    return path if path.to_s.start_with?("http")

    "#{base(site)}#{path.to_s.start_with?('/') ? '' : '/'}#{path}"
  end

  def person_id(site)
    "#{base(site)}/#person"
  end

  def website_id(site)
    "#{base(site)}/#website"
  end

  def about(site)
    site.data["about"] || {}
  end

  def profile(site)
    about(site)["profile"] || {}
  end

  def date_iso(value)
    return nil if value.nil?

    value.respond_to?(:iso8601) ? value.iso8601 : value.to_s
  end

  # Strip Markdown links/IALs and HTML so text reads cleanly in JSON-LD.
  def plain(text)
    return "" if text.nil?

    text.to_s
        .gsub(/\{:[^}]*\}/, "")
        .gsub(/\[([^\]]+)\]\(([^)]+)\)/, '\1')
        .gsub(/<[^>]+>/, "")
        .gsub(/\s+/, " ")
        .strip
  end

  def image_object(site, src, caption)
    return nil if src.nil? || src.to_s.empty?

    dims = (site.data["image_dimensions"] || {})[src] || {}
    obj = {
      "@type" => "ImageObject",
      "url" => abs(site, src),
      "contentUrl" => abs(site, src),
      "caption" => caption,
      "creator" => { "@id" => person_id(site) },
      "creditText" => profile(site)["full_name"] || site.config.dig("author", "name"),
      "copyrightNotice" => "© #{profile(site)['full_name'] || site.config.dig('author', 'name')}",
    }
    obj["width"] = dims["width"] if dims["width"]
    obj["height"] = dims["height"] if dims["height"]
    obj.compact
  end

  # _data/photos.yml is only comments until a photo is added, which YAML reads as false.
  def photos(site)
    list = site.data["photos"]
    list.is_a?(Array) ? list.select { |x| x.is_a?(Hash) && x["src"] } : []
  end

  def projects(site)
    site.collections["projects"]&.docs || []
  end

  def arts(site)
    site.collections["arts"]&.docs || []
  end

  def posts(site)
    site.posts.docs.sort_by(&:date).reverse
  end

  # Every technology named across the projects, plus the interest keywords.
  def knows_about(site)
    tech = projects(site).flat_map { |d| Array(d.data["tech"]) }
    interests = Array(about(site)["interests"]).flat_map do |i|
      [i["name"], *i["keywords"].to_s.split(",")]
    end
    extra = Array(profile(site)["knows_about"])
    (extra + interests + tech).map { |t| t.to_s.strip }.reject(&:empty?).uniq
  end

  def project_awards(site)
    projects(site).select { |d| d.data["award"] }.sort_by { |d| d.data["date"].to_s }.reverse
  end

  # Empty Arts pages carry noindex (see head.html), so keep them out of the sitemap too.
  def empty_arts_page?(site, page)
    return false unless page.url.start_with?("/arts/")
    return false if page.respond_to?(:collection) && page.collection&.label == "arts"

    medium = page.data["medium_name"]
    items = arts(site)
    items = items.select { |d| d.data["medium"] == medium } if medium
    items.empty?
  end
end
