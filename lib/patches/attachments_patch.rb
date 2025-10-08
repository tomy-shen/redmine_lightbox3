# redmine_lightbox3/lib/patches/attachments_patch.rb

module Patches # <-- 新增：包在 Patches 模組中
  module AttachmentsPatch
    def self.included(base)
      base.extend(ClassMethods)
      base.send(:include, InstanceMethods)

      base.class_eval do
        # 給附件連結新增 css class
        alias_method_chain :link_to_attachment, :lightbox_class
      end
    end

    module ClassMethods
    end

    module InstanceMethods
      # 在連結中新增 css class "lightbox"
      def link_to_attachment_with_lightbox_class(options = {})
        # 原始的方法
        link_to_attachment_without_lightbox_class(options).
          gsub('>').
          gsub('</a>', ' class="lightbox"></a>')
      end
    end
  end
end
