VI.Views.IndexQueriesView = Backbone.View.extend({

  // initialize: function() {
  //   var vineTemplate = _.template({vine_url: datum});
  // },

  events: {
    "click button.search": "initiateSearch"
  },

  initiateSearch: function() {
    var that = this;
    var queryString = encodeURIComponent(that.$(".search-query").val())
    Backbone.history.navigate("search?" + queryString, {trigger: true});
  },

  render: function(){
    var that = this;
    var renderedContent = JST["queries/index"]({
      queries: that.collection
    })
    that.$el.html(renderedContent);
    return that;
  },

  // getResults: function(event){
  //   var that = this;
  //   var query = "vine%20" + encodeURIComponent(that.$(".search-query").val());
  //   $.getJSON("http://search.twitter.com/search.json?callback=?",{
  //     include_entities: "true",
  //     q: query
  //   }, function(data) {
  //     console.log(data);
  //     that.generateVines(data.results);
  //   });
  // },

  // generateVines: function(data){
  //   VI.Store.VineResults = new VI.Collections.Vines;
  //   var regex = /vine\.co\/v\/([A-Za-z0-9]*)/;
  //   _.each(data, function(datum){
  //     // url = (regex.exec(datum.entities.urls.expanded_url))
  //     // if(url){
  //       // var urlFrag = regex.exec(datum.text)[1]
  //       console.log(datum.entities.urls[0].expanded_url);
  //       var vineData = ({
  //         url: datum.entities.urls[0].expanded_url, 
  //         from_user: datum.from_user,
  //         from_user_id: datum.from_user_id,
  //         from_user_name: datum.from_user_name,
  //         created_at: datum.created_at,
  //         profile_image_url: datum.profile_image_url,
  //         text: datum.text, 
  //       });
  //       VI.Store.VineResults.add(vineData);
  //     // }
  //   });
  //   console.log(VI.Store.VineResults);
  // }


});