/*!
 * jQuery plugin for haivision's video player
 *
 * based on the jQuery namespaced 'Starter' plugin boilerplate by @dougneiner & @addyosmani
 * Licensed under the MIT license
 */

;(function($) {
    if (!$.npm) {
        $.npm = {};
    };

    $.npm.hvplayer = function ( el, params, options ) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        base.params = params;

        // Add a reverse reference to the DOM object
        base.$el.data( "npm.hvplayer" , base );

        base.init = function () {
            base.mediaId = null;
            base.options = $.extend({}, $.npm.hvplayer.defaultOptions, options);

            // calculate aspect ratio - default to 16:9
            var w = (base.options.width == 0) ? 16 : base.options.width;
            var h = (base.options.height == 0) ? 9 : base.options.height;
            base.options.aspectReverse = '' + ((h/w)*100) + '%';

            // set width & height of iframe
            base.options.iframeWidth = (base.options.width == 0) ? "100%" : base.options.width;
            base.options.iframeHeight = (base.options.height == 0) ? "100%" : base.options.height;

            base.options.queryString = '';
            if (!$.isEmptyObject(base.options.params)) {
                base.options.queryString = '?params=' + escape( $.param(base.options.params) );
            }

            if ( base.params['mediaId'] ) {
                base.log('gonna play the media with ID '+base.params.mediaId );
                base.mediaId = base.params.mediaId;
                var playerUrl = base.playerUrl(base.mediaId, base.options);
                base.options.renderTemplate( base.$el, $.extend({},base.options, { mediaId: base.mediaId, playerUrl: playerUrl }) );
           } else if ( base.params['guid'] ) {
                var feedUrl = "http://feed.theplatform.com/f/"+base.options.accountId+"/"+base.options.feedId+"/?form=json&fields=title,content&fileFields=releases,contentType&releaseFields=pid&byGuid="+base.params.guid;
                base.log("Get media info from the Guid, Feed URL: "+feedUrl);
                $.getJSON( feedUrl, function(json) {
                    if (json.entryCount == 0) {
                      base.options.renderError( base.$el, "No media found with guid "+base.params.guid);
                      return;
                    }
                    var entry = json.entries[0];
                    base.log('** got the feed json for '+entry.title);

                    // get either the first video item or audio item
                    var mediaType = base.options.hasOwnProperty('type') ? base.options.type : 'video';
                    var mediaItem = false;
                    // iterate through media$content items until we find the right type
                    for(var i=0;i<entry.media$content.length;i++) {
                      var item = entry.media$content[i];
                      var contentType = item.plfile$contentType;
                      if (contentType == mediaType) {
                        mediaItem = item;
                        break;
                      }
                    }
                    if (mediaItem) {
                        base.mediaId = mediaItem.plfile$releases[0].plrelease$pid;
                        base.log('The media ID to play the '+mediaType+' is '+base.mediaId);
                        var playerUrl = base.playerUrl(base.mediaId, base.options);
                        base.options.renderTemplate( base.$el, $.extend({},base.options, { mediaId: base.mediaId, playerUrl: playerUrl }) );

                    } else {
                        base.log('The media ID to play the '+mediaType+' was not found!');
                        // how to handle an error?
                    }

                });

            }
        };

        base.playerUrl = function(mediaId,opts) {
          return "http://player.theplatform.com/p/" + opts.accountId + "/" + opts.playerId + "/embed/select/" + mediaId + opts.queryString;
        };

        base.log = function(s) {
            if (!base.options.debug) return;
            if (typeof console === 'undefined') {
                console = {log: function() {},info: function() {}};
            }
            if (typeof s === 'object' || typeof s === 'array') console.info(s);
            else console.log(s);
        };

        // Run initializer
        base.init();
    };

    $.npm.hvplayer.defaultOptions = {
        accountId: false, // REQUIRED
        playerId: false, // REQUIRED
        renderTemplate: function($el,data) {
          var $iframe = $("<iframe>").attr({
            src: data.playerUrl,
            width: data.iframeWidth,
            height: data.iframeHeight,
            frameBorder: 0,
            seamless: "seamless",
            allowFullScreen: "allowFullScreen"
          });
          if (data.wrap) {
            $elem = $("<div>").attr({style:"position: relative; padding-bottom: " + data.aspectReverse +"; height: 0px;"});
            $innerElem = $("<div>").attr({style:"position: absolute; top: 0px; left: 0px; height: 100%; width: 100%;"});
            $innerElem.html($iframe);
            $elem.html($innerElem);
            $el.html( $elem );
          } else {
            $el.html( $iframe );
          }
        },
        wrap: true, // add the wrapping divs to keep aspect ratio and fill the parent container
        renderError: function($el,msg) {
          $el.append( $("<p>").html("An error occured loading the player: "+msg) );
        },
        feedId: false, // only if using the by guid method
        pdkJs: "//pdk.theplatform.com/pdk/tpPdk.js",
        width: 0,
        height: 0,
        debug: false,
        type: "video",
        params: {
            form: 'html'
        }

    };

    $.fn.npm_hvplayer = function
        ( mediaId, options ) {
        return this.each(function () {
            (new $.npm.hvplayer(this, { mediaId: mediaId }, options));
        });
    };

    $.fn.npm_hvplayer_by_guid = function
        ( guid, options ) {
        return this.each(function () {
            (new $.npm.hvplayer(this, { guid: guid }, options));
        });
    };

})(jQuery);
