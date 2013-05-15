VI.Collections.Vines = Backbone.Collection.extend({
  model: VI.Models.Vine,
  //To improve performance, vine models are stored client-side only.
  sync: function () { return false; },

//Sends an HTTP request to the Twitter search API for Vine.co links and passes the returned data.
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

//Checks if each returned tweet has a valid URL before calling the scrapeVine method.

  addFromQuery: function(data, callback) {
  var that = this;
  _.each(data, function(datum){
    if(datum.entities.urls){
      that.scrapeVine(datum.entities.urls[0].expanded_url, datum, callback)
    };
  });
  },

  //Performs a YQL HTML scrape on the twitter link to extract a link to the raw video file

  scrapeVine: function(url, datum, callback) {
    var that = this;
    $.get(url, function(res) {
      regex = /https:\/\/vines\.s3\.amazonaws\.com\/v\/videos\/[^\"]*/
      if (regex.exec(res.responseText)){
        endUrl = regex.exec(res.responseText)[0];
        that.makeModel(endUrl, datum, callback);
      }
    });
  },

  //Creates a Backbone model for a single Vine

  makeModel: function(endUrl, datum, callback) {
    var that = this;
    var vineData = ({
      // The amazon s3 video URL
      url: endUrl,
      // Vine's embed link as a fallback for browsers lacking HTML5 video
      fallback_url: datum.entities.urls[0].expanded_url,
      from_user: datum.from_user,
      from_user_id: datum.from_user_id,
      from_user_name: datum.from_user_name,
      created_at: datum.created_at,
      profile_image_url: datum.profile_image_url,
      text: datum.text, 
    });
    // Ensure Vine URL is unique before adding to collection
    if (that.findWhere({url: vineData.url}) == undefined) {
      newVine = new VI.Models.Vine(vineData);
      that.add(newVine);
      callback(newVine);
    }
  }
});