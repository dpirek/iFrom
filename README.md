ABOUT:
This is a simple jquery plugin that lets you do cross domain "ajax-like" posts.

USAGE:
$('form').iForm({
    start: function(button){
      //alert('loaded');
    },
    sucess: function (button) {
      alert('loaded');
    }  
});