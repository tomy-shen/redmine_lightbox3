# redmine_lightbox3/init.rb

require 'redmine'
require 'fileutils' # <-- 引入文件操作模組

# === 資產複製邏輯：確保靜態檔案存在於 public/plugin_assets ===
plugin_dir = Rails.root.join('plugins', 'redmine_lightbox3')
public_dir = Rails.root.join('public', 'plugin_assets', 'redmine_lightbox3')

# 確保目標目錄存在
FileUtils.mkdir_p(public_dir) unless File.directory?(public_dir.to_s)

# 複製 assets/javascripts, assets/stylesheets, 和 assets/images
['javascripts', 'stylesheets', 'images'].each do |asset_type|
  source = plugin_dir.join('app', 'assets', asset_type)
  target = public_dir.join(asset_type)
  
  if File.directory?(source.to_s)
    # 如果目標子目錄不存在，則執行複製
    unless File.directory?(target.to_s)
        # 使用 cp_r 複製整個目錄內容
        FileUtils.cp_r(source.to_s, public_dir.to_s) 
    end
  end
end
# =============================================================


Redmine::Plugin.register :redmine_lightbox3 do
  name 'Lightbox3 Plugin (Support Redmine 6 or higher)'
  author 'tomy'
  description 'This is a plugin for Redmine to preview image and PDF attachments in a lightbox'
  version '1.0.0'
  url 'https://redmine-tw.net'
  author_url 'https://github.com/tomy-shen'

  requires_redmine :version_or_higher => '6.0.0'

  # 確保 Hook 檔案被載入
  require_relative 'lib/hooks/view_layouts_base_html_head_hook'


  # Rails 7/Redmine 6 兼容性修正：使用 ActiveSupport::Reloader 載入 Patch
  ActiveSupport::Reloader.to_prepare do
    require_relative 'lib/patches/attachments_patch'
    
    # 應用 Patch
    unless Attachment.included_modules.include?(Patches::AttachmentsPatch)
      Attachment.send(:include, Patches::AttachmentsPatch)
    end
  end
end
