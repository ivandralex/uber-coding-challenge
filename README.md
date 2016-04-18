# Uber Coding Challenge - Food Trucks#


### Technical track ###

I've selected full-stack technical track with slight focus shift towards back-end.

### Technical stack ###

Client-side:

* JavaScript
* Angular
* Twitter Bootstrap
* Google Maps JS API
* Grunt

Server-side:

* Node.js (application logic) - has prior experience
* MongoDB (food trucks data) - has prior experience
* RabbitMQ (managing task queues) - no prior experience
* ExpessJS (RESTful API) - has prior experience

I used Yeoman scaffolding tool to create template for my app. You can see generated code in the first commit of this repository. Most of the generated code has been modified. As of the last commit generated code can be found mostly in server/config, server/routes.js, client/app/app.js, Gruntfile.js

### Architecture overview ###

Client-side:

SPA built with Angular, sends requests to Search API, uses Google Maps JS API to render map.

Server-side:



### Search API ###

Search API - performs search of food trucks around specified location

Supported HTTP verbs:

```
#!javascript

POST /api/foodtrucks/search
```
Request parameters:

* longitude - longitude of the search location in degrees (valid range [-180; 180]
* latitude - latitude of the search location in degrees (valid range [-90; 90]
* radius - radius of the search neighbourhood in meters

Output example:

```
#!javascript

[{
_id: ""
address: "355 07TH ST"
daysHours: "Mo-Fr:8AM-9AM"
externalObjectId: "765882"
foodItems: ["cold truck", "packaged sandwiches", "pitas", "breakfast", "cold and hot drinks", "snacks"]
loc: {type: "Point", coordinates: [-122.406934051626, 37.7763814259936]}
locationDescription: "07TH ST: CLEVELAND ST to HARRISON ST (314 - 399)"
permitStatus: "APPROVED"
schedule: "http://example.org/schedule.pdf"
title: "Munch A Bunch"
type: "Truck"
}, ... ]
```

Output fields:

* title - title of food truck
* address - address of food truck
* foodItems - list of food items offered at this food truck
* loc - location of the food truck (GeoJSON point)
* _id - internal food truck identifier
* externalObjectId - identifier of the food truck from SF OpenData dataset
* daysHours - food truck operation hours