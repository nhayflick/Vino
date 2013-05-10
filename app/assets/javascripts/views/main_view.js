VI.Views.MainView = Backbone.View.extend({

  events: {
    "keypress input[type=text]": "initiateSearch"
  },

  render: function(){
    console.log("rendering")

    var that = this;
    var renderedContent = JST["main/index"]({
      queries: that.collection
    });
    that.$el.html(renderedContent)
    return that;
  },

  initiateSearch: function(e) {
    if (e.keyCode != 13) return;
    var that = this;
    var queryString = encodeURIComponent(that.$(".search-query").val())
    Backbone.history.navigate("search?" + queryString, {trigger: true});
  },

}); 