# Ratings Widget

### Description

This is a ratings widget that can be plugged into any web page

### Features

    * Show selected user rating (if present) and total user rating
    * Option for users to mark ratings
    * Option to use it as a readonly widget
    * Option to include more instances within the same page both read and write
    * Configurable by replacing sprites and templates

### Usage

##### config

* You need to define POST url for putting ratings data under ratings.js config variable

##### Dependencies

* YUI3 Library - http://yui.yahooapis.com/3.17.2/build/yui/yui-min.js
* Mustache.js  - https://raw.githubusercontent.com/janl/mustache.js/master/mustache.js

##### Data Structure

The JSON structure of data is as follows:

```json
{
    ratingObjId: 1,
    ratingUserValuePct: 0,
    ratingUserValue: false,
    ratingText: 4.5,
    ratingUsers: 500
}
```