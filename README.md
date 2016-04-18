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

### Architecture justification ###

Food Trucks app uses external data source. SF OpenData provides its own API. It's not reliable to use external API per-request because it imposes serious technical risks (if OpenData website goes down we'll be unable to serve content, we can't control OpenData API performance). We need to store a copy of the OpenData's dataset and perform scheduled synchronization. Our dataset is updated daily.

We should provide user with food truck around specified location. We need to have geo coordinates for every food truck. As I found out geo coordinates are available not for all food trucks, but all of them have address field specified. We need to augment food trucks data with coordinates using geocoding based on food truck address. Also we want to have efficient way to query database for food trucks around specified location so we need geospatial indexes support in database.

Thus we need to perform 2 type of tasks: scheduled data import using OpenData API, geocoding of food trucks.

### Architecture overview ###

#### Client-side ####

SPA built with Angular, sends requests to Search API, uses Google Maps JS API to render map and food trucks information.

#### Server-side ####

Server-side application consists of 4 main components:

* Web server app - provides Search API to client applications
* Data Import worker - handles data import job, creates Geo Coding jobs for newly imported data
* Scheduler - creates data import job
* Geo Coding worker - handles geo coding jobs

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
_id: "",
address: "355 07TH ST",
daysHours: "Mo-Fr:8AM-9AM",
externalObjectId: "765882",
foodItems: ["cold truck", "packaged sandwiches", "pitas", "breakfast", "cold and hot drinks", "snacks"],
loc: {type: "Point", coordinates: [-122.406934051626, 37.7763814259936]},
title: "Munch A Bunch",
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