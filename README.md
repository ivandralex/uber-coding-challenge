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

Food Trucks app uses external data source. SF OpenData provides its own API. It's not reliable to use external API per-request because it imposes serious technical risks (if OpenData website goes down we'll be unable to serve content, we can't control OpenData API performance). We need to store a copy of the OpenData's dataset and perform scheduled synchronization. Our dataset is updated daily (dataset on OpenData website is updated on daily basis as well).

We should provide user with information on what types of food trucks are available around specified location. We need to have geo coordinates for every food truck. As I found out geo coordinates are available not for all food trucks, but all of them have address field specified. We need to augment food trucks data with coordinates using geocoding based on food truck address. Also we want to have efficient way to query database for food trucks around specified location so we need geospatial indexes support in database.

Thus we need to perform 2 type of tasks: scheduled data import using OpenData API, geocoding of food trucks.

### Architecture overview ###

#### Client-side ####

SPA built with Angular, sends requests to Search API, uses Google Maps JS API to render map and food trucks information.

#### Server-side ####

Server-side application consists of 4 main components:

* **Web server app** - provides Search API to client applications
* **Data Import worker** - handles data import job, creates Geo Coding jobs for newly imported data
* **Scheduler** - creates data import job
* **Geo Coding worker** - handles geo coding jobs

I've selected MongoDB as a primary database for my app. I use it to store food trucks data in documents. I use geospatial indexes to perform search of food trucks by geo location. We rely on external data source and its data format may change at any time and we may face data migration tasks very often. Schema-less storage is more suitable solution for this scenario.

I utilized RabbitMQ to manage worker jobs. In my prior experience I used Redis to implement task queues. I decided to use RabbitMQ in this project because it's a solution specialized on this particular task and provides more flexibility.  

**Web server app** knows nothing about Open Data and geo coding. It serves data from MongoDB and provides Search API (described below) to client applications.

Workers are implemented in the form of independent applications that can be run in parallel on separate machines.

Import job is created by **Scheduler**. **Scheduler** is a separate application having single responsibility - to create Data Import job and put it into task queue once a day. It uses MongoDB to store data import operations journal.

**Data Import worker** downloads food trucks data using Open Data API and stores it in MongoDB. Also **Data Import worker** creates jobs for **Geo Coding worker**. I decided to grant this responsibility to 
**Data Import worker** (instead of creating independent mechanism) because percentage of food trucks data entities requiring geocoding is reasonably small (about 10%) and it's efficient to create this job from 
**Data Import worker**. Though such a solution may impose architectural risks and should be reevaluated in later versions of the app.

**Geo Coding worker** handles geocoding jobs contained in task queue and updates food trucks entities in MongoDB with geo coordinates. It's implementing geocoding with use of Google Maps API. Though it's recommended by Google to use combination of client-side and server-side geocoding it's not suitable for our application. Using serverside-only geocoding imposes a risk of reaching Google Maps API limit (2500 requests from IP). But having independent workers we can scale them horizontally and distribute jobs among many workers so the Google Maps API usage limit will not be exceeded.

All components of server-side application designed to be horizontally scalable. Though current version doesn't have load balancer that would distribute requests among several **Web server apps** it can be easily introduced into architecture without any change to business logic. I consider to implement load balancer with use of Uber's Ringpop library in the next version of the app.

Also all 4 components of the system use database abstraction layer to access data storage. DAL isolates business logic from API of particular database drivers and gives us freedom to easily migrate our data storage to other databases in future.  


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
* radius - radius of the search neighborhood in meters

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

### Future improvements ###

* Better test coverage
* JSON schema validation for OpenData's dataset
* Implement load balancer
* Implement deep-linking for food trucks
* Food trucks filtering by food items

### Online version ###

Application available on http://uber.adville.ru/