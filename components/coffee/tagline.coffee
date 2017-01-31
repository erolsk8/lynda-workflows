# Tell browserify to require jQuery
$ = require 'jquery'

do fill = (item = 'The most creative minds in Art - Coffee Edit - Auto Page Reload') ->
  $('.tagline').append "#{item}"
fill