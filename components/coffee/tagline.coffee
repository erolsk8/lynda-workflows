# Tell browserify to require jQuery
$ = require 'jquery'

do fill = (item = 'The most creative minds in Art - Edit Again - Auto Page Reload') ->
  $('.tagline').append "#{item}"
fill