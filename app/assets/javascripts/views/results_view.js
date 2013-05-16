VI.Views.ResultsView = Backbone.View.extend({

  tagName: 'ul',
  className: 'all-vines',
  scrollHeight: 0,
  okToScroll: true,
  target: null,
  liOffset: 630,

//This listens for the first Vine li to be appended and then initiates the search scroll

  initialize: function() {
    var that = this;

    that.listenToOnce(that.collection, 'add', that.scrollToFirst());
  },

  render: function() {
    var that = this;
    var renderedContent = JST["results/index"]();
    // that.$("nav-stuff").remove();
    that.$el.append(renderedContent);
    return that;
  },

  scrollToFirst: function() {
    var that = this
    setTimeout(function(){
      var v = document.createElement("video");
      // Checks for browser compatibility
      if (v.canPlayType("video/mp4") != '') {
        video = $(".vine").first().find("video")
        console.log("here")
        that.playVine(video);
      }
    }, 4000);
    // Scrolls down to the first video
    setTimeout(function(){
      that.scrollHeight += ($(".content").offset().top);
      $("html,body").animate({ scrollTop: that.scrollHeight}, "slow");
      // Unhides the navbar
      $(".navbar").slideDown();
    }, 1000);  
  },

  scrollToNext: function() {
    var that = this
    // If the user has scrolled on their own, auto-scroll won't fire
    if(that.okToScroll){
      setTimeout(function() {
        that.enableAutoScrollDetector();
      }, 1000)
    that.scrollHeight += that.liOffset;
    $("html,body").animate({ scrollTop: that.scrollHeight}, "slow");
    setTimeout(function() {
      that.targetVineOnScreen();
      nextVid = $(that.target).find("video")
      that.playVine(nextVid);
      }, 1000)
    }
  },

  //This disables auto-scroll whenever the user is manually scrolling

  enableAutoScrollDetector: function() {
    var that = this;
    $(window).on('scroll', function (ev) {
      // if($(window).scrollTop() + $(window).height() == $(document).height()) {
      //   console.log("bottom!");
      //   that.returnMoreResults();
      // }
      that.okToScroll = false;
      that.targetVineOnScreen();
      video = $(that.target).find("video")
      that.load(video);
    });
  },

  disableAutoScrollDetector: function() {
    $(window).off('scroll');
  },

  load: function(video) {
    if(video.get(0).readyState === 0) {
      video.load();
    }
  },

  playVine: function(video) {
    var that = this;
      video.get(0).play();
      // Updates the NowPlaying Store with the model of the current Vine
      var nowPlaying = that.collection.findWhere({url: video.attr("src")})
      VI.Store.CurrentlyPlaying.reset(nowPlaying);
      // console.log("Currently Playing:" + VI.Store.CurrentlyPlaying.first().get("text"));
      //When the video ends, autoscroll to the next video (but first check that this isn't the last vid)
      video.on("ended", function(e) {
        that.disableAutoScrollDetector();
        video.off("ended")
        if(!that.isLast(video)) {
          that.scrollToNext();
        }
      });
  },

  isLast: function(video) {
    var that = this;
    if (that.collection.last() == VI.Store.CurrentlyPlaying.first()) {
      return true;
    } else {
      return false;
    }
  },


//Helper-function that sets 'target' to the jQuery video object for the current Vine on the screen
  targetVineOnScreen: function() {
    var that = this;
    screenOffset = $(window).scrollTop()
    $(".vine").each(function(i){
      if((that.findTopOffset(this) - screenOffset) + 0 <= 545) {
        that.target = this;
      }
    })
    if (screenOffset == 0) {
      $(".navbar").hide('slide');
    }
  },

  // Helper function that finds the absolute Y distance of any Dom Element from the top of the window

  findTopOffset: function(el){
    var offsetTop = 0;
    do {
      if ( !isNaN( el.offsetTop ) )
      {
          offsetTop += el.offsetTop;
      }
    } while( el = el.offsetParent );
    console.log(offsetTop)
    return offsetTop;
  },

  //WIP:

  // returnMoreResults: function() {
  //   var that = this;
  //   if (VI.Store.NextPageURL){
  //     var fetchCallback = function(vine) {
  //       var showResults = new VI.Views.ShowResults({
  //         model: vine
  //       });
  //     that.append(showResults.render().$el);
  //   };
  //     that.collection.fetchMoreTweets(VI.Store.NextPageURL, fetchCallback);
  //   }
  // }

});