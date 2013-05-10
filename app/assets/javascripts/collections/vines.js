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
    // console.log(data);
    that.addFromQuery(data.results, callback);
  });
},

  // var yql = 'http://query.yahooapis.com/v1/public/yql?'
  //       + 'q=' + encodeURIComponent('select * from json where url=@url')
  //       + '&url=http://search.twitter.com/search.json?include_entities=true&q=vine.co%2520pugs'
  //       + '&format=json&callback=?';
  // $.getJSON( yql, that.cbFunc);

  // $.get("http://search.twitter.com/search.json?include_entities=true&q=vine.co%2520pugs", function(res) {
  //   console.log(res);
  //   console.log($.parseJSON(res.responseText));
  // });


//git push heroku production:master

// $.ajaxSetup({
//   beforeSend: function(request) {
//     request.setRequestHeader("User-Agent","Vino");
//   }
// });

    // $.ajax({
    //   url: 'http://www.google.com',
    //   type: 'GET',
    //   dataType: 'jsonp',
    //   success:function(data){
    //     alert(data);
    //   }
    // });

    // $.ajax({
    //   url: 'http://search.twitter.com/search',
    //   type: 'GET',
    //   dataType: 'jsonp',
    //    async: false,
    //   data: {
    //     include_entities: 'true',
    //     q: query
    //   },
    //   success: function() {that.addFromQuery(data.results, callback) },
    //   error: function() { alert('vino is not pleased') },
    //   // beforeSend: setHeader
    // });
  // },

  cbFunc: function(data) {
    console.log(data);
  },

  // setHeader: function(xhr) {
  //   xhr.setRequestHeader('User-Agent', 'Vino/0.5')
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
      from_user: datum.from_user,
      from_user_id: datum.from_user_id,
      from_user_name: datum.from_user_name,
      created_at: datum.created_at,
      profile_image_url: datum.profile_image_url,
      text: datum.text, 
    });
    newVine = new VI.Models.Vine(vineData);
    that.add(newVine);
    console.log(that);
    callback(newVine);
  }
});