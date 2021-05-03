# Sierra Summits API

## Live Link

https://sierra-summits.vercel.app

### Documentation

Sierra Summits API solicits two endpoints: 
/peaks & /comments

The SPS Peak Finder page makes a GET all peaks request, then users can sort and filter the data via the client side of the application.

Each peak has a detailed page where a GET peak by ID request is made to access further details and information on each specific peak.

Each peak also holds a summit register where comments are applied to each specific peak. 

A GET comments by peak ID request is made at the component did mount life cycle.

Users can add comments by making a POST request.

### POSTGRESQL Database

There are two tables in the database for this application. A peaks table which holds all of the peak data, and a comments table. The comments table refereces the peakID via a foreign key.
