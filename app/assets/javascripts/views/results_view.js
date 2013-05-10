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

    that.listenToOnce(that.collection, 'add', that.scrollToFirst());

  


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
    console.log("scrolled")
    var that = this
    setTimeout(function(){
      video = $(".vine").first().find("video")
      that.playFirst(video);
    }, 5000);
    setTimeout(function(){
      that.scrollHeight += ($(".content").offset().top - 70);
      that.liOffset = that.scrollHeight - 370;
      $("html,body").animate({ scrollTop: that.scrollHeight}, "slow");
      // console.log(document.elementFromPoint(300, ($(window).scrollTop() + 400)));
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
      console.log(that.findTopOffset(this));
      console.log(((that.findTopOffset(this) - screenOffset + 360) <= 545))
      if((that.findTopOffset(this) - screenOffset) + 360 <= 545) {
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
  },

  findScrollDifference: function(){
    
  }

});