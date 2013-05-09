VI.Views.ShowResults = Backbone.View.extend({

  tagName: 'div',
  className: 'vine',

  render: function(){
    var that = this;
    var renderedContent = JST["queries/show"]({
        vine: that.model
    })
    that.$el.html(renderedContent);
    return that;
  }
});