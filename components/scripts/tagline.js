var $, fill;

$ = require('jquery');

(fill = function(item) {
  return $('.tagline').append("" + item);
})('The most creative minds in Art - Coffee Edit - Auto Page Reload');

fill;
