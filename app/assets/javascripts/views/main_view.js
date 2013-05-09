VI.Views.MainView = Backbone.View.extend({

  events: {
    "click button.search": "initiateSearch"
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

  initiateSearch: function() {
    var that = this;
    var queryString = encodeURIComponent(that.$(".search-query").val())
    Backbone.history.navigate("search?" + queryString, {trigger: true});
  },

}); 