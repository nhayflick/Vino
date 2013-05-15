VI.Views.ResultsView = Backbone.View.extend({

  tagName: 'ul',
  className: 'all-vines',
  scrollHeight: 0,
  okToScroll: true,
  target: null,
  liOffset: 630,

//This listens for the first Vine li to be appended and then initiates the search scroll

  initialize: function() {
    // console.log("init")
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

  render: function() {
    var that = this;
    var renderedContent = JST["results/index"]();
    that.$("nav-stuff").remove();
    that.$el.append(renderedContent);
    return that;
  },

  scrollToFirst: function() {
    var that = this
    // console.log(that.collection)
    setTimeout(function(){
    var v = document.createElement("video");
    if (v.canPlayType("video/mp4") != '') {
      video = $(".vine").first().find("video")
      that.playVine(video);
    }
    }, 5000);
    setTimeout(function(){
      that.scrollHeight += ($(".content").offset().top);
      $("html,body").animate({ scrollTop: that.scrollHeight}, "slow");
      // console.log(document.elementFromPoint(300, ($(window).scrollTop() + 400)));
      $(".navbar").slideDown();
    }, 3000);  
  },

  scrollToNext: function() {
    var that = this
    if(that.okToScroll){
      setTimeout(function() {
        that.enableAutoScrollDetector();
      }, 1000)
    that.scrollHeight += that.liOffset;
    console.log(that.liOffset);
    $("html,body").animate({ scrollTop: that.scrollHeight}, "slow");
    setTimeout(function() {
      that.targetVineOnScreen();
      nextVid = $(that.target).find("video")
      that.playVine(nextVid);
      }, 1000)
    }
  },

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
    // console.log(video);
    // video.load();
    // video.get(0).addEventListener("canplay", function(e) {
      video.get(0).play();
      var nowPlaying = that.collection.findWhere({url: video.attr("src")})
      VI.Store.CurrentlyPlaying.reset(nowPlaying);
      that.render();
      console.log("Currently Playing:" + VI.Store.CurrentlyPlaying.first().get("text"));
    // });
    // setTimeout(function(){
      video.on("ended", function(e) {
        that.disableAutoScrollDetector();
        video.off("ended")
        if(!that.isLast(video)) {
          that.scrollToNext();
        }
      });
    // }, 2000);
  },

  isLast: function(video) {
    var that = this;
    if (that.collection.last() == VI.Store.CurrentlyPlaying.first()) {
      return true;
    } else {
      return false;
    }
  },

  targetVineOnScreen: function() {
    var that = this;
    screenOffset = $(window).scrollTop()
    // console.log(screenOffset)
    $(".vine").each(function(i){
      // console.log(that.findTopOffset(this));
      // console.log(((that.findTopOffset(this) - screenOffset + 360) <= 545))
      if((that.findTopOffset(this) - screenOffset) + 0 <= 545) {
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
    console.log(offsetTop)
    return offsetTop;
  },

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



  // findVineOffset: function(){
  //   var that = this;
  //   // console.log($(".vine:eq(1)"));
  //   // console.log(that.findTopOffset($(".vine:eq(1)")));
  //   // console.log(that.findTopOffset($(".vine:eq(0)")));
  //   console.log(that.findTopOffset($(".vine:eq(1)")) - that.findTopOffset($(".vine:eq(0)")))
  //   return that.findTopOffset(".vine:eq(1)") - that.findTopOffset(".vine:eq(0)")
  // }

});