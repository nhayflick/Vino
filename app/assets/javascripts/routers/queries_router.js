VI.Routers.QueriesRouter = Backbone.Router.extend({

  initialize: function(content) {
    this.$contentEl = $(content)
  },

  routes: {
    'search?*queryString': 'search'
  },


  search: function(queryString) {
    var that = this;
    var results = new VI.Collections.Vines();
    // Tracks the user's currently playing Vine in the navbar
    VI.Store.CurrentlyPlaying.reset();
    // Stores the URL for further page results from Twitter
    VI.Store.NextPageURL = null;
    var resultsView = new VI.Views.ResultsView({
      collection: results
    });
    that.$contentEl.html(resultsView.render().$el);
    // Waits until the Vine collection is done instantiating itself and then appends a view for each
    // returned Vine.
    function fetchCallback(vine) {
      var showResults = new VI.Views.ShowResults({
        model: vine
      });
      $(".all-vines").append(showResults.render().$el);
    };
    results.twitterFetch(queryString, fetchCallback);
  }


});