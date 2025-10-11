# frozen_string_literal: true

require 'fileutils'

# --- Asset Deployment Logic with Pure Ruby Pathing ---
# This version uses pure Ruby methods (`__dir__`) to be immune to Rails' boot sequence issues.

# 1. Define key paths using pure Ruby
plugin_name = 'redmine_lightbox3'

# THE ONLY FIX IS HERE: `__dir__` itself is the plugin's root directory.
# `File.expand_path('..', __dir__)` was incorrect as it went up one level.
plugin_root = __dir__

source_assets = File.join(plugin_root, 'app', 'assets')
public_dest = File.join(Rails.root.to_s, 'public', 'plugin_assets', plugin_name)
version_file = File.join(public_dest, 'version.txt')

# 2. Get the "Code Version" by parsing this init.rb file itself.
code_version = nil
init_rb_content = File.read(File.join(plugin_root, 'init.rb'))
if match = init_rb_content.match(/version\s+['"]([^'"]+)['"]/)
  code_version = match[1]
end

# 3. Read the version of the assets currently on disk
public_version = File.exist?(version_file) ? File.read(version_file).strip : nil

# 4. Compare versions and redeploy if they don't match.
if code_version.to_s != public_version.to_s && !code_version.nil?
  puts "Redmine Lightbox 3: Version mismatch (code: #{code_version}, public: #{public_version}). Redeploying assets."
  FileUtils.rm_rf(public_dest)
  FileUtils.mkdir_p(public_dest)
  FileUtils.cp_r(File.join(source_assets, '.'), public_dest)
  File.open(version_file, 'w') { |f| f.write(code_version) }
end


# --- Plugin Registration ---
Redmine::Plugin.register :redmine_lightbox3 do
  name 'Lightbox3 Plugin (Support Redmine 6 or higher)'
  author 'tomy'
  description 'This is a plugin for Redmine to preview image and PDF attachments in a lightbox'
  version '1.1.0'
  url 'https://redmine-tw.net'
  author_url 'https://github.com/tomy-shen'

  requires_redmine version_or_higher: '6.0.0'

  require_relative 'lib/hooks/view_layouts_base_html_head_hook'

  ActiveSupport::Reloader.to_prepare do
    require_relative 'lib/patches/attachments_patch'
    unless Attachment.included_modules.include?(Patches::AttachmentsPatch)
      Attachment.send(:include, Patches::AttachmentsPatch)
    end
  end
end
