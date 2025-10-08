# redmine_lightbox3/lib/hooks/view_layouts_base_html_head_hook.rb

module Hooks
  class ViewLayoutsBaseHtmlHeadHook < Redmine::Hook::ViewListener
    # 這是將 JS/CSS 包含進去的函式
    def view_layouts_base_html_head(context={})
      
      # 確保所有路徑都包含子目錄 'javascripts/' 或 'stylesheets/'
      
      # 載入 JavaScript
      js_tags = [
        '<script src="/plugin_assets/redmine_lightbox3/javascripts/jquery.fancybox-3.5.7.min.js" type="text/javascript"></script>',
        '<script src="/plugin_assets/redmine_lightbox3/javascripts/lightbox.js" type="text/javascript"></script>'
      ].join("\n")

      # 載入 CSS
      css_tags = [
        '<link href="/plugin_assets/redmine_lightbox3/stylesheets/jquery.fancybox-3.5.7.min.css" media="all" rel="stylesheet" type="text/css" />',
        '<link href="/plugin_assets/redmine_lightbox3/stylesheets/lightbox.css" media="all" rel="stylesheet" type="text/css" />'
      ].join("\n")

      (js_tags + "\n" + css_tags).html_safe
    end
  end
end
