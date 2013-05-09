VI.Views.ResultsView = Backbone.View.extend({

  tagName: 'ul',
  className: 'all-vines',
  scrollHeight: 0,
  okToScroll: true,
  target: null,

//This listens for the first Vine li to be appended and then initiates the search scroll

  initialize: function() {
    console.log("init")
    var that = this;

    that.listenToOnce(that.collection, 'change', that.scrollToFirst());

    var opts = {
      lines: 11, // The number of lines to draw
      length: 17, // The length of each line
      width: 11, // The line thickness
      radius: 30, // The radius of the inner circle
      corners: 0.8, // Corner roundness (0..1)
      rotate: 42, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb
      speed: 1, // Rounds per second
      trail: 55, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };
    var target = $(".body");
    var spinner = new Spinner(opts).spin(target);


  //   MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    
  //   var observer = new MutationObserver(function(mutations, observer) {
  //   // fired when a mutation occurs
  //     console.log(mutations, observer, "MUTATE");
  //     that.scrollToFirst();
  //   });

  //   observer.takeRecords();

  //   observer.observe($(".content")[0], {
  //     subtree: true,
  //     attributes: true
  //   //...
  //   });
  },

  scrollToFirst: function() {
    var that = this
    setTimeout(function(){
      video = $(".vine").first().find("video")
      that.playFirst(video);
    }, 3000);
    setTimeout(function(){
      that.scrollHeight += ($(".content").offset().top);
      that.liOffset = that.scrollHeight - 230;
      $("html,body").animate({ scrollTop: that.scrollHeight}, "slow");
      console.log(document.elementFromPoint(300, ($(window).scrollTop() + 200)));
      $(".navbar").slideDown();
    }, 1000);  
  },

  scrollToNext: function() {
    var that = this
    if(that.okToScroll){
      setTimeout(function() {
        that.enableAutoScrollDetector();
      }, 1000)
    that.scrollHeight += that.liOffset;
    // console.log(that.scrollHeight)
    $("html,body").animate({ scrollTop: that.scrollHeight}, "slow");
    setTimeout(function() {
      that.targetVineOnScreen();
      nextVid = $(that.target).find("video")
      that.playFirst(nextVid);
      }, 1000)
    }
  },

  enableAutoScrollDetector: function() {
    var that = this;
    $(window).on('scroll', function (ev) {
      // console.log("here!")
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

  playFirst: function(video) {
    var that = this;
    // console.log(video);
    video.load();
    video.get(0).play();
    video.get(0).addEventListener("ended", function(e) {
      that.disableAutoScrollDetector();
      that.scrollToNext()
    });
  },

  videoReady: function() {
    console.log(videoReady)
  },

  targetVineOnScreen: function() {
    var that = this;
    screenOffset = $(window).scrollTop()
    // console.log(screenOffset)
    $(".vine").each(function(i){
      // console.log(that.findTopOffset(this));
      // console.log(((that.findTopOffset(this) - screenOffset + 160) <= 545))
      if((that.findTopOffset(this) - screenOffset) + 500 <= 545) {
        that.target = this;
        // return false;
      }
    })
    if (screenOffset == 0) {
      $(".navbar").hide('slide');
    }
    // that.target = null;
  },

  findTopOffset: function(el){
    var offsetTop = 0;
    do {
      if ( !isNaN( el.offsetTop ) )
      {
          offsetTop += el.offsetTop;
      }
    } while( el = el.offsetParent );
    return offsetTop;
  }

});