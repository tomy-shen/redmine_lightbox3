/*
 * Lightbox3 for Redmine 6 - Universal Compatibility Version
 * This script is designed to work with both Redmine 6.0.x and 6.1.x,
 * especially handling the different HTML structures for journal attachments.
 *
 * UPDATE: The applyLightbox function now explicitly ignores download icon links.
 */
$(document).ready(function() {

    // --- A smart function to process any link and decide if it needs a lightbox ---
    function applyLightbox(linkElement) {
        var $link = $(linkElement);
        var href = $link.attr('href') || "";
        var text = $link.text() || "";

        // THE KEY CHANGE IS HERE: We added a new condition to ignore download icons.
        if ($link.hasClass('delete') || $link.hasClass('icon-del') || $link.hasClass('icon-download') || href === "") {
            return;
        }

        var isImage = href.match(/\.(jpe?g|png|gif|bmp|webp)$/i) || text.match(/\.(jpe?g|png|gif|bmp|webp)$/i);
        var isPdf = href.match(/\.pdf$/i) || text.match(/\.pdf$/i);

        if (isImage) {
            $link.addClass('lightbox');
        } else if (isPdf) {
            $link.addClass('lightbox').attr('data-type', 'iframe');
        }
    }


    // --- Apply the logic to all relevant sections ---

    // 1. Main Attachment Block, Documents, News, Files etc. (Works for both versions)
    $('div.attachments a, table.documents a.attachment, div.news a.attachment, div.wiki .attachments a').each(function() {
        applyLightbox(this);
    });

    // 2. Journal / Notes Section - The key compatibility fix
    var journalAttachmentSelectors = [
        'div.journal ul.details a[href*="/attachments/"]:not(.icon-download)',    // Redmine 6.0.x filename links
        'div.journal div.thumbnails a',                                         // Redmine 6.0.x thumbnail links
        'div.journal ul.journal-details a[href*="/attachments/"]:not(.icon-download)', // Redmine 6.1.x filename links
        'div.journal .thumbnail a'                                              // Redmine 6.1.x thumbnail links
    ].join(', ');

    $(journalAttachmentSelectors).each(function() {
        var $link = $(this);
        var wrongHref = $link.attr('href');
        var filename = $link.find('img').attr('alt') || $link.find('img').attr('title') || $link.text().trim();

        if (wrongHref && filename) {
            var attachmentId = wrongHref.split('/')[2];
            if ($.isNumeric(attachmentId)) {
                var correctHref = '/attachments/download/' + attachmentId + '/' + filename;
                $link.attr('href', correctHref);
                applyLightbox(this);
            }
        }
    });
    
    // 3. Wiki Embedded Thumbnails (Works for both versions)
    $('div.wiki a.thumbnail').each(function() {
        var $link = $(this);
        var wrongHref = $link.attr('href');
        var $image = $link.find('img');
        var filename = $image.attr('alt'); 

        if (wrongHref && filename) {
            var attachmentId = wrongHref.split('/')[2];
            if ($.isNumeric(attachmentId)) {
                var correctHref = '/attachments/download/' + attachmentId + '/' + filename;
                $link.attr('href', correctHref);
                applyLightbox(this);
            }
        }
    });

    // --- INITIALIZE LIGHTBOX ---
    $('a.lightbox').fancybox({
        iframe: {
            preload: false
        }
    });

});
