# frozen_string_literal: true

require "cgi"
require_relative "seo_helpers"

# Writes three files at build time, all from existing content:
#
#   /sitemap.xml    — every page, with every picture on it (project screenshots,
#                     art, About photos) as image entries so they show up in
#                     Google Images. Replaces jekyll-sitemap's version, which
#                     can't list images. Empty Arts pages and the 404 stay out.
#   /llms.txt       — a short, link-rich summary of who Mami is and everything
#                     on the site, in the llms.txt format AI assistants read.
#   /llms-full.txt  — the same, plus the full text of the About page, every
#                     project write-up and every blog post, in one plain file.
module PortfolioSEO
  class SitemapAndLlms < Jekyll::Generator
    safe true
    priority :low # after normal generators, before jekyll-sitemap (:lowest) so it skips its own

    def generate(site)
      @site = site
      add(site, "sitemap.xml", sitemap)
      add(site, "llms.txt", llms(full: false))
      add(site, "llms-full.txt", llms(full: true))
    end

    private

    def add(site, name, content)
      page = Jekyll::PageWithoutAFile.new(site, site.source, "", name)
      page.content = content
      page.data["layout"] = nil
      page.data["sitemap"] = false
      page.data["render_with_liquid"] = false
      site.pages << page
    end

    # ---------- sitemap ----------

    def sitemap
      entries = []
      @site.pages.each do |p|
        next unless p.html? || p.url.end_with?("/")
        next if p.data["sitemap"] == false || p.data["redirect"] || p.url == "/404.html"
        next if PortfolioSEO.empty_arts_page?(@site, p)

        entries << [p.url, @site.time, page_images(p)]
      end
      (PortfolioSEO.projects(@site) + PortfolioSEO.arts(@site) + PortfolioSEO.posts(@site)).each do |d|
        next if d.data["sitemap"] == false

        lastmod = d.data["last_modified_at"] || d.data["date"] || @site.time
        imgs = d.data["image"] ? [d.data["image"]] : []
        entries << [d.url, lastmod, imgs]
      end

      xml = +%(<?xml version="1.0" encoding="UTF-8"?>\n)
      xml << %(<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n)
      entries.uniq(&:first).sort_by(&:first).each do |url, lastmod, imgs|
        xml << "  <url>\n    <loc>#{esc(PortfolioSEO.abs(@site, url))}</loc>\n"
        xml << "    <lastmod>#{lastmod.respond_to?(:iso8601) ? lastmod.iso8601 : lastmod}</lastmod>\n"
        imgs.compact.uniq.each do |src|
          xml << "    <image:image><image:loc>#{esc(PortfolioSEO.abs(@site, src))}</image:loc></image:image>\n"
        end
        xml << "  </url>\n"
      end
      xml << "</urlset>\n"
    end

    # Images that appear on an index-type page: the cards it lists, plus About photos.
    def page_images(page)
      url = page.url
      photos = url == "/bio/" ? PortfolioSEO.photos(@site).map { |p| p["src"] } : []
      featured = url == "/" ? PortfolioSEO.projects(@site).select { |d| d.data["featured"] }.map { |d| d.data["image"] } : []
      listed =
        case url
        when "/projects/" then PortfolioSEO.projects(@site).map { |d| d.data["image"] }
        when %r{\A/projects/category/([^/]+)/\z}
          cat = Array(@site.data.dig("categories", "projects")).find { |c| c["slug"] == Regexp.last_match(1) }
          cat ? PortfolioSEO.projects(@site).select { |d| d.data["category"] == cat["name"] }.map { |d| d.data["image"] } : []
        when "/arts/" then PortfolioSEO.arts(@site).map { |d| d.data["image"] }
        when %r{\A/arts/medium/} then PortfolioSEO.arts(@site).select { |d| d.data["medium"] == page.data["medium_name"] }.map { |d| d.data["image"] }
        else []
        end
      (photos + featured + listed).compact
    end

    def esc(s)
      CGI.escapeHTML(s.to_s)
    end

    # ---------- llms.txt ----------

    def u(path)
      PortfolioSEO.abs(@site, path)
    end

    # Raw Markdown → readable Markdown: drop Liquid, kramdown attributes and HTML,
    # keep links, turn YouTube embeds into plain video links.
    def clean(text)
      t = text.to_s.dup
      t.gsub!(%r{<iframe[^>]*src="https://www\.youtube\.com/embed/([\w-]+)[^"]*"[^>]*>\s*</iframe>}m) { "Video demo: https://youtu.be/#{Regexp.last_match(1)}" }
      t.gsub!(%r{<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>}m) { "[#{Regexp.last_match(2)}](#{Regexp.last_match(1)})" }
      # site links like (/projects/mytime/) become full URLs, so they still work read outside the site
      t.gsub!(%r{\]\((/[^)\s]*)\)}) { "](#{u(Regexp.last_match(1))})" }
      t.gsub!(/\{%.*?%\}/m, "")
      t.gsub!(/\{\{.*?\}\}/m, "")
      t.gsub!(/\{:[^}]*\}/, "")
      t.gsub!(/<[^>]+>/, "")
      t.gsub!(/^#####\s*/, "### ")
      t.gsub!(/^(#+)\s/) { "#{Regexp.last_match(1)}## " } # nest under the item heading
      t.gsub!(/\n{3,}/, "\n\n")
      t.strip
    end

    def date(d)
      d.respond_to?(:strftime) ? d.strftime("%B %-d, %Y") : d.to_s
    end

    def llms(full:)
      about = PortfolioSEO.about(@site)
      prof = PortfolioSEO.profile(@site)
      email = @site.config.dig("author", "email")
      name = prof["full_name"] || @site.config.dig("author", "name")
      out = +""

      out << "# #{name} (Mami Ravaloarison)\n\n"
      out << "> #{PortfolioSEO.plain(about['headline'])}\n\n"
      out << "This is the personal website of #{name}, who goes by Mami Ravaloarison. " \
             "Everything below is written by Mami and is the authoritative source about Mami " \
             "and Mami's projects, writing and art. Website: #{u('/')}\n\n"

      out << "## Key facts\n\n"
      facts = []
      facts << "Full name: #{name}. Goes by: #{Array(prof['also_known_as']).join(', ')}." unless Array(prof["also_known_as"]).empty?
      facts << "Role: #{Array(prof['job_titles']).join('; ')}." unless Array(prof["job_titles"]).empty?
      facts << "Works at: #{prof.dig('works_for', 'department')}, #{prof.dig('works_for', 'name')}." if prof["works_for"]
      facts << "Based in: #{prof['home_location']}. From: #{prof['from_country']}." if prof["home_location"]
      Array(about["education"]).each do |e|
        bits = [e["score"], e["minor"] && "minor in #{e['minor']}"].compact.join(", ")
        facts << "Education: #{e['studyType']}, #{e['area']} — #{e['institution']} (#{e['location']}), #{e['start_date']}–#{e['end_date']}#{bits.empty? ? '' : " (#{bits})"}."
      end
      Array(about["awards"]).each { |a| facts << "Award: #{a['title']} — #{a['summary']}" }
      facts << "Languages: #{Array(about['languages']).map { |l| "#{l['name']}: #{l['summary']}" }.join('; ')}."
      unless about["looking_for"].to_s.empty?
        facts << "Currently looking for: #{PortfolioSEO.plain(about['looking_for'].gsub('%email%', email.to_s))}"
      end
      facts << "Contact: #{email}"
      facts << "Profiles: #{Array(@site.config.dig('social', 'links')).join(', ')}"
      out << facts.map { |f| "- #{f}" }.join("\n") << "\n\n"

      out << "## Pages\n\n"
      out << "- [About Mami Ravaloarison](#{u('/')}): bio, experience, education, awards, certificates, languages and interests\n"
      out << "- [Projects](#{u('/projects/')}): #{PortfolioSEO.projects(@site).size} projects — work, personal and hackathon\n"
      out << "- [Blog](#{u('/blog/')}): #{PortfolioSEO.posts(@site).size} posts\n"
      out << "- [Arts](#{u('/arts/')}): drawings and digital art\n" unless PortfolioSEO.arts(@site).empty?
      out << "- [Full text of this site](#{u('/llms-full.txt')}): everything below in full, in one file\n" unless full
      out << "\n"

      out << (full ? about_full(about, email) : "")
      out << projects_section(full)
      out << posts_section(full)
      out << arts_section(full)
      out << photos_section if full
      out
    end

    def about_full(about, email)
      drawing = PortfolioSEO.arts(@site).empty? ? "drawing" : "[drawing](#{u('/arts/')})"
      bio = about["bio"].to_s.gsub("%email%", email.to_s).gsub("%drawing%", drawing)
      out = +"## About Mami (bio, in Mami's own words)\n\n#{clean(bio)}\n\n"
      out << "### Experience\n\n"
      Array(about["experience"]).each do |j|
        out << "- **#{j['position']}**, #{j['company']} — #{j['location']} (#{j['start_date']}–#{j['end_date']})\n"
        Array(j["highlights"]).each { |h| out << "  - #{h}\n" }
      end
      out << "\n### Awards\n\n"
      Array(about["awards"]).each do |a|
        out << "- **#{a['title']}** (#{a['awarder']}, #{a['date']}): #{a['summary']}\n"
        next unless a["show_wins"]

        PortfolioSEO.project_awards(@site).each do |d|
          out << "  - #{PortfolioSEO.award_text(d.data)}, for [#{d.data['title']}](#{u(d.url)})\n"
        end
      end
      out << "\n### Certificates\n\n"
      Array(about["certificates"]).each { |c| out << "- #{c['name']} — #{c['issuer']}, #{c['date']}\n" }
      out << "\n### Interests\n\n"
      Array(about["interests"]).each { |i| out << "- #{i['name']}: #{i['keywords']}\n" }
      out << "\n"
    end

    def projects_section(full)
      cats = Array(@site.data.dig("categories", "projects"))
      out = +"## Projects\n\n"
      cats.each do |c|
        docs = PortfolioSEO.projects(@site).select { |d| d.data["category"] == c["name"] }.sort_by { |d| d.data["date"].to_s }.reverse
        next if docs.empty?

        out << "### #{c['name']} projects\n\n" unless full
        docs.each do |d|
          x = d.data
          if full
            out << "### #{x['title']} (#{c['name']} project)\n\n"
            out << "- Page: #{u(d.url)}\n"
            out << "- Status: in progress\n" if x["status"] == "ongoing"
            out << "- Award: #{PortfolioSEO.award_text(x)}\n" if x["award"]
            out << "- Built with: #{Array(x['tech']).join(', ')}\n" if x["tech"]
            (x["links"] || {}).each { |k, v| out << "- #{k.capitalize}: #{v}\n" if v && !v.empty? }
            out << "- Screenshot: #{u(x['image'])} — #{x['image_alt']}\n" if x["image"]
            out << "\n#{x['description']}\n\n#{clean(d.content)}\n\n"
          else
            award = x["award"] ? " Won #{PortfolioSEO.award_text(x)}." : ""
            status = x["status"] == "ongoing" ? " (in progress)" : ""
            out << "- [#{x['title']}](#{u(d.url)})#{status}: #{x['description']}#{award} Built with #{Array(x['tech']).join(', ')}.\n"
          end
        end
        out << "\n" unless full
      end
      out
    end

    def posts_section(full)
      posts = PortfolioSEO.posts(@site)
      return "" if posts.empty?

      out = +"## Blog posts\n\n"
      posts.each do |d|
        x = d.data
        if full
          out << "### #{x['title']}\n\n- Page: #{u(d.url)}\n- Published: #{date(d.date)}\n- Tags: #{Array(x['tags']).join(', ')}\n\n"
          out << "#{clean(d.content)}\n\n"
        else
          out << "- [#{x['title']}](#{u(d.url)}) (#{date(d.date)}): #{x['description']}\n"
        end
      end
      out << "\n" unless full
      out
    end

    def arts_section(full)
      arts = PortfolioSEO.arts(@site).sort_by { |d| d.data["date"].to_s }.reverse
      return "" if arts.empty?

      out = +"## Art\n\n"
      arts.each do |d|
        x = d.data
        if full
          out << "### #{x['title']} (#{x['medium']})\n\n- Page: #{u(d.url)}\n- Image: #{u(x['image'])} — #{x['image_alt']}\n"
          out << "- Tools: #{Array(x['tools']).join(', ')}\n- Date: #{date(x['date'])}\n\n#{x['description']}\n\n#{clean(d.content)}\n\n"
        else
          out << "- [#{x['title']}](#{u(d.url)}) (#{x['medium']}): #{x['description']}\n"
        end
      end
      out << "\n" unless full
      out
    end

    def photos_section
      photos = PortfolioSEO.photos(@site)
      return "" if photos.empty?

      "## Photos of Mami\n\n" + photos.map { |p| "- #{u(p['src'])} — #{p['alt']}" }.join("\n") + "\n"
    end
  end
end
