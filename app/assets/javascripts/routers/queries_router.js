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
    var resultsView = new VI.Views.ResultsView({
      collection: results
    });
    that.$contentEl.html(resultsView.$el);
    function fetchCallback(vine) {
      var showResults = new VI.Views.ShowResults({
        model: vine
      });
      that.$contentEl.append(showResults.render().$el);
    };
    results.twitterFetch(queryString, fetchCallback);
  }


});