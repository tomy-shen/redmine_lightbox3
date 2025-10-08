// redmine_lightbox3/app/assets/javascripts/lightbox.js

$(document).ready(function() {
  // the file extension regex matching on supported image and pdf types
  var extensionRegexImage = /\.(png|jpe?g|gif|bmp)$/i;
  var extensionRegexAll = /\.(png|jpe?g|gif|bmp|pdf)$/i;

  // modify thumbnail links in wiki content -> add filename from ./img/@alt to url to support fancybox preview
  $("div.wiki a.thumbnail").attr('href', function(i, v){
    return v.replace(/\/attachments\/(\d+)/g,'/attachments/download/$1') + '/' + $(this).children('img').attr('alt').replace(/(.*\.(png|jpe?g|gif|bmp))(\s\(.*\))?/gi,'$1');
  });

  // modify filename links in journal details -> add filename to url to support fancybox preview
  $("div.journal ul.details li a:not([title])").attr('href', function(i, v){
    if($(this).html().match(extensionRegexAll)) {
      return v.replace(/\/attachments\/(\d+)/g,'/attachments/download/$1') + '/' + $(this).html();
    } else {
      return v;
    }
  });

  // modify thumbnail links after journal details -> add filename to url to support fancybox preview
  $("div.journal div.thumbnails a[title]").attr('href', function(i, v){
    if($(this).attr('title').match(extensionRegexAll)) {
      return v.replace(/\/attachments\/(\d+)/g,'/attachments/download/$1') + '/' + $(this).attr('title');
    } else {
      return v;
    }
  });

  // add a magnifier icon before download icon for images and pdf
  $("div.journal ul.details li a.icon-download")
  .add("table.list.files a.icon-download")  // #72 also for 'files' module
  .each(function(i, obj) {
    if($(this).attr('href').match(extensionRegexAll)) {
      var icon = $(this).clone().attr('class', function(i, v){
        return v.replace(/-download/g,'-magnifier');
      }).removeAttr('title');
      icon.insertBefore($(this));
    }
  });

  // add rel attribute to thumbnails of the same journal entry
  $("div.journal div.thumbnails a").each(function(i, obj) {
    var relgroup = 'thumbnails-' + $(this).closest('div.journal').attr('id')
    $(this)
      .attr('rel', relgroup)
      .attr('data-fancybox', relgroup)
  });


  // #72 support for Files module
  $("table.list.files td.filename a").each(function(i, obj) {
    var href = $(this).attr('href');
    var filename = $(this).text();
    var title = $(this).attr('title');
    // Also support PDF preview in lightbox
    var isPdf = filename.match(/\.pdf$/i);
    // only apply thumbnail class to image and pdf links
    if(filename.match(extensionRegexAll)) {
      $(this)
        .attr('href', href.replace(/\/attachments\/(\d+)/g,'/attachments/download/$1/' + filename))
        .addClass(isPdf ? 'lightbox pdf' : 'lightbox')
        .attr('data-type', isPdf ? 'iframe' : 'image')
        .attr('data-caption', title ? filename + ' - ' + title : filename);
    }
  });


  // DMSF support
  var dmsf_link_selector = "a[data-downloadurl][href^='/dmsf/files/'][href$='/view']";

  // #40 ... add class="thumbnail" to DMSF macro thumbnails on wiki pages
  $("div.wiki " + dmsf_link_selector).each(function(i, obj) {
    var filename = $(this).attr('data-downloadurl').split(':')[1];
    // Also support PDF preview in lightbox
    var isPdf = filename.match(/\.pdf$/i);
    // only apply thumbnail class to image and pdf links
    if(filename.match(extensionRegexAll)) {
      $(this)
        .addClass('thumbnail')
        .attr('data-type', isPdf ? 'iframe' : 'image')
        .attr('title', $(this).text())
        .attr('data-caption', filename)
        .removeAttr('target')
        .removeAttr('data-downloadurl');
    }
  });

  // #63 ... add class="lightbox" to DMSF image links in DMS browser
  $(".controller-dmsf #browser .dmsf_title " + dmsf_link_selector).each(function(i, obj) {
    var filename = $(this).attr('data-downloadurl').split(':')[1];
    // only apply thumbnail class to image and pdf links
    if(filename.match(extensionRegexImage)) {
      $(this)
        .addClass('lightbox')
        .attr('data-type', 'image')
        .attr('title', $(this).text())
        .attr('data-caption', filename)
        .attr('rel', 'dmsf-browser')
        .attr('data-fancybox', 'dmsf-browser')
        .removeAttr('target')
        .removeAttr('data-downloadurl');
    }
  });

  // #53 DMSF support in issues: add class="lightbox" to DMSF thumbnails and preview links
  $("div.attachments.dmsf_parent_container a[href^='/dmsf/files/'][href$='/view']").each(function(i, obj) {
    // extract filename from attribute 'data-downloadurl' from closest element with the same 'href'
    var href = $(this).attr('href');
    var ddUrl = $(this).attr('data-downloadurl');
    var dmsfId = href.replace(/.*\/files\/(\d+)\/view/g, '$1');
    var filename = "";
    var title = ""

    // For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
    // https://css-tricks.com/snippets/jquery/make-an-jquery-hasattr/
    if (typeof ddUrl !== typeof undefined && ddUrl !== false) {
      // read local attribute if present (on DMSF textlinks)
      filename = ddUrl.split(':')[1];
      title = $(this).text();
    } else {
      // or read from corresponding DMSF textlink if no local data-downloadurl is present
      var correspondingElem = $("div.attachments.dmsf_parent_container > p > a[href='" + href + "'].dmsf-icon-file").first()
      filename = correspondingElem.attr('data-downloadurl').split(':')[1];
      title = correspondingElem.text();
    }

    // create 3 fancybox 'rel' groups to avoid image duplicates in slideshow
    var relgroup = '';
    if($(this).closest('div.thumbnails').length) {
      relgroup = 'thumbnails';
    } else if($(this).hasClass('icon-only')) {
      relgroup = 'icon';
    } else if($(this).hasClass('icon')) {
      relgroup = 'imagelink';
    }
    // Also support PDF preview in lightbox
    var isPdf = filename.match(/\.pdf$/i);
    // only apply thumbnail class to image and pdf links
    if(filename.match(extensionRegexAll)) {
      $(this)
        .addClass('lightbox')
        .attr('data-type', isPdf ? 'iframe' : 'image')
        .attr('title', "[" + dmsfId + "] " + title)
        .attr('data-caption', "[" + dmsfId + "] " + title)
        .attr('data-fancybox', 'dmsf-' + relgroup);
        // do not remove 'data-downloadurl' here otherwise the filename extraction crashes for following dmsf thumbnails
    }
  });


  // Add Fancybox to image links
  $("div.attachments a.lightbox")
  .add("div.attachments a.lightbox_preview")
  .add("table.list.files a.icon-magnifier:not([href$='.pdf'])")
  .add( $("div.journal ul.details a:not(.icon-download)").filter(function(index,elem) { return $(elem).attr('href').match(extensionRegexImage) }) )
  .add("div.journal div.thumbnails a")
  .add("div.wiki a.thumbnail")
  .add(".controller-dmsf #browser a.lightbox")
  .add(".avatar a")
  .add("table.list.files td.filename a.lightbox")
  .fancybox({
    animationEffect     : 'zoom',
    animationDuration   : 200,
    transitionEffect    : 'fade',
    transitionDuration  : 200,
    buttons: [
      'zoom',
      'fullScreen',
      'download',
      'thumbs',
      'close'
    ]
  });

  // Add Fancybox to PDF links
  $("div.attachments a.pdf")
  .add("table.list.files td.filename a.lightbox.pdf")
  .add("table.list.files a.icon-magnifier[href$='.pdf']")
  .add( $("div.journal ul.details a:not(.icon-download)").filter(function(index,elem) { return $(elem).attr('href').match(/\.pdf$/i) }) )
  .add( $("div.journal div.thumbnails a").filter(function(index,elem) { return $(elem).attr('href').match(/\.pdf$/i) }) )
  .fancybox({
    animationEffect     : 'zoom',
    animationDuration   : 200,
    transitionEffect    : 'fade',
    transitionDuration  : 200,
    type                : 'iframe',
    iframe : {
      preload: true
    },
    buttons: [
      'fullScreen',
      'download',
      'close'
    ]
  });
});
