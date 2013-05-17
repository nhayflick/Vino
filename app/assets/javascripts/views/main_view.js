VI.Views.MainView = Backbone.View.extend({

  events: {
    "keypress input[type=text]": "initiateSearch",
    "click button.main": "initiateSearch"
  },

  render: function(){
    console.log("rendering")

    var that = this;
    // console.log(that.collection.pluck("body"));
    var renderedContent = JST["main/index"]({
      queries: that.collection
    });
    that.$el.html(renderedContent)
    that.$('.info-link').tooltip({placement: "bottom"})
    return that;
  },

    //Navigates to a hashtag url encompassing the user's current querystring


  initiateSearch: function(e) {
    console.log(e.keyCode)
    if (e.keyCode != (13 ) && e.keyCode !=  undefined) return;
    var that = this;
    var queryString = encodeURIComponent(that.$(".search-query").val())
    Backbone.history.navigate("search?" + queryString, {trigger: true});
  },

}); 