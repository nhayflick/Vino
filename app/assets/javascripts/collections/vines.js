VI.Collections.Vines = Backbone.Collection.extend({
  model: VI.Models.Vine,
  sync: function () { return false; },



twitterFetch: function(querystring, callback) {
  var that = this;
  var query = "vine.co%20" + encodeURIComponent(querystring);
  var queryModel = new VI.Models.Query({body: querystring});
  queryModel.save();
  $.getJSON("http://search.twitter.com/search.json?callback=?",{
      include_entities: "true",
      q: query
    }, function(data) {
    if(data.next_page) {
      VI.Store.NextPageURL = data.next_page
    }
    that.addFromQuery(data.results, callback);
  });
},

//git push heroku production:master

//Working on fetch-more-results:

  // fetchMoreTweets: function(url, callback) {
  //   var that = this;
  //   console.log(url)
  //   $.getJSON("http://search.twitter.com/search.json?callback=?",{
  //       include_entities: "true",
  //       q: url,
  //       page: 2,
  //     }, function(data) {
  //     if(data.next_page) {
  //       VI.Store.NextPageURL = data.next_page
  //     }
  //     that.addFromQuery(data.results, callback);
  //   });
  // },

  addFromQuery: function(data, callback) {
  var that = this;
  _.each(data, function(datum){
    console.log(datum)
    // var regex = /\/\/t\.co/;
    // url = (regex.exec(datum.text))
    // console.log(url);
    if(datum.entities.urls){
      that.scrapeVine(datum.entities.urls[0].expanded_url, datum, callback)
    };
  });
  },

  scrapeVine: function(url, datum, callback) {
    var that = this;
    $.get(url, function(res) {
      // console.log(res.responseText)
      regex = /https:\/\/vines\.s3\.amazonaws\.com\/v\/videos\/[^\"]*/
      if (regex.exec(res.responseText)){
        endUrl = regex.exec(res.responseText)[0];
        that.makeModel(endUrl, datum, callback);
      }
    });
  },

  makeModel: function(endUrl, datum, callback) {
    var that = this;
    var vineData = ({
      url: endUrl,
      fallback_url: datum.entities.urls[0].expanded_url,
      from_user: datum.from_user,
      from_user_id: datum.from_user_id,
      from_user_name: datum.from_user_name,
      created_at: datum.created_at,
      profile_image_url: datum.profile_image_url,
      text: datum.text, 
    });
    // Ensure Vine Url is unique before adding to collection
    if (that.findWhere({url: vineData.url}) == undefined) {
      newVine = new VI.Models.Vine(vineData);
      that.add(newVine);
      callback(newVine);
    }
  }
});