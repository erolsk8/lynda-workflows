# Tell browserify to require jQuery
$ = require 'jquery'

do fill = (item = 'The most creative minds in Art - Edit Again') ->
  $('.tagline').append "#{item}"
fill