Cooper-Hewitt API mashup example
===============

This is an example mobile app that is a mashup of the Google, Yahoo, and Cooper-Hewitt Museum APIs. 

## Synopsis

After entering a city or region name, the map geocodes the location using Google's geocoder and sends the lat./long. to Yahoo's API, which returns the wind direction and speed for the location. The [Cooper-Hewitt collection API](https://collection.cooperhewitt.org/api) is then searched for an American Airlines poster that shows a place that is in the direction the wind is blowing. For example, if you enter "Brooklyn, NY" and the wind is blowing east, you may get a poster for Ireland, Rome, Holland, etc. If you enter "Chicago, IL" and the wind is blowing south or southwest, you may get a poster for Mexico, etc. 

## Installation

  Use `npm install` to install the required node modules. 

  Use `grunt production` to compile a production deploy in the `www` directory.


## Screenshots

The opening screen. The user enters a location.

![opening screen](https://raw.github.com/anselmbradford/cooperhewittapi/master/screenshots/opening.png)

The app queries the Yahoo weather API and returns wind information.

![poster screen](https://raw.github.com/anselmbradford/cooperhewittapi/master/screenshots/wind.png)

The user can then view a poster that is geographically themed in the direction of the wind, which is pulled from the [Cooper-Hewitt collection API](https://collection.cooperhewitt.org/api).

![wind screen](https://raw.github.com/anselmbradford/cooperhewittapi/master/screenshots/poster.png)
