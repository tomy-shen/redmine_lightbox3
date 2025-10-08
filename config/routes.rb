#if Gem::Version.new("3.0") > Gem::Version.new(Rails.version) then
#  #Redmine 1.x
#  ActionController::Routing::Routes.draw do |map|
#    map.connect 'attachments/download_inline/:id/:filename', :controller => 'attachments', :action => 'download_inline', :id => /\d+/, :filename => /.*/
#  end
#
#else
#  #Redmine 2.x
#  RedmineApp::Application.routes.draw do
#    get 'attachments/download_inline/:id/:filename', :controller => 'attachments', :action => 'download_inline', :id => /\d+/, :filename => /.*/
#  end
#end


# redmine_lightbox3/config/routes.rb
# 簡化為 Redmine 2.x/3.x/4.x/5.x/6.x (Rails 3+ 語法)

RedmineApp::Application.routes.draw do
  # 註釋掉不再使用的 download_inline 路由，以防萬一保留註解。
  # get 'attachments/download_inline/:id/:filename', :controller => 'attachments', :action => 'download_inline', :id => /\d+/, :filename => /.*/
end
