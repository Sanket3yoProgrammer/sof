(function($) {

/**
 * Core behavior for Non-Cliclable Menu Items.
 */
Drupal.behaviors.nonClickableMenuItems = {
  attach: function (context, settings) {
    var isAbsolute = new RegExp('^([a-z]+://|//)', 'i');
    var menuContext = 'body';
    if (settings.nonClickableMenuItems.context) {
      menuContext = settings.nonClickableMenuItems.context;
    }
    if (settings.nonClickableMenuItems.urls.length) {
      $(menuContext).find('a').each(function() {
        let $link = $(this);
        let $href = $(this).attr('href');
        let list = [];
        if (isAbsolute.test($href)) {
          /*
          @todo check if absolute url match to relative urls from list of urls.
          */
          list.push($href);
        }
        else {
          list.push($href);
          if ($href.indexOf('index.html') === 0) {
            list.push($href.replace("index.html", ''));
          }
        }
        $.each(list, function(index, value) {
          if ($.inArray(value, settings.nonClickableMenuItems.urls) != -1) {
            $link.click(function() {
              return false;
            });
          }
        });
      });
    }
  }
};

})(jQuery);
