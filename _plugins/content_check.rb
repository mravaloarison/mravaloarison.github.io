# frozen_string_literal: true

# Build-time check (CLAUDE.md, linking rule 8): stop the build if a project,
# piece of art, post or About photo is missing what search engines need, so
# nothing goes live without a title, a description or alt text.
Jekyll::Hooks.register :site, :post_read do |site|
  problems = []
  warnings = []
  categories = Array(site.data.dig("categories", "projects")).map { |c| c["name"] }
  mediums = Array(site.data.dig("categories", "arts")).map { |c| c["name"] }

  check = lambda do |doc, fields|
    fields.each do |f|
      v = doc.data[f]
      problems << "#{doc.relative_path}: missing `#{f}`" if v.nil? || v.to_s.strip.empty?
    end
    d = doc.data["description"].to_s
    warnings << "#{doc.relative_path}: description is #{d.length} characters (aim for 120–160)" if d.length.positive? && (d.length < 70 || d.length > 200)
  end

  (site.collections["projects"]&.docs || []).each do |doc|
    check.call(doc, %w(title description category image image_alt))
    unless categories.empty? || categories.include?(doc.data["category"])
      problems << "#{doc.relative_path}: category must be one of #{categories.join(', ')}"
    end
  end
  (site.collections["arts"]&.docs || []).each do |doc|
    check.call(doc, %w(title description medium image image_alt))
    unless mediums.empty? || mediums.include?(doc.data["medium"])
      problems << "#{doc.relative_path}: medium must be one of #{mediums.join(', ')}"
    end
  end
  site.posts.docs.each { |doc| check.call(doc, %w(title description)) }
  photos = site.data["photos"].is_a?(Array) ? site.data["photos"] : []
  photos.each_with_index do |p, i|
    next problems << "_data/photos.yml item #{i + 1}: needs `src` and `alt`" unless p.is_a?(Hash)

    problems << "_data/photos.yml item #{i + 1}: missing `alt`" if p["alt"].to_s.strip.empty?
  end

  warnings.each { |w| Jekyll.logger.warn "SEO check:", w }
  unless problems.empty?
    problems.each { |p| Jekyll.logger.error "SEO check:", p }
    raise Jekyll::Errors::FatalException, "SEO check failed — fix the items above (see CLAUDE.md, linking rule 8)."
  end
end
