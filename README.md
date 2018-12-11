# mws-stage-3
Mobile Web Specialist Certification Course
[Demo](https://cdn.glitch.com/cb093bfd-142f-45b3-bdb4-52ff49e0a1c2%2FrestaurantDemo.mp4?1544493276576)
---

**To run my version of the project** - install all the dependencies with 'npm install', then run 'gulp start'. That will trigger gulp to compile all the files and start browser-sync, which will automatically launch a browser window pointing to localhost. 

The main JS files are all saved in the js folder. Saving in any of those files while the gulp start task is running will trigger an automatic recompiling of the files, and a refresh of the browser page should show the changes. (Ideally browser-sync should auto-reload the page, but sometimes it doesn't.) Same goes for the CSS file or either of the HTML files.

#### _Three Stage Course Material Project - Restaurant Reviews_

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application.

## Project Overview: Stage 1

In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

Stage One Project Rubric - [Stage 1 Rubric](https://review.udacity.com/#!/rubrics/1090/view)

## Project Overview: Stage 2

In **Stage Two**, you will take the responsive, accessible design you built in Stage One and connect it to an external server. You’ll begin by using asynchronous JavaScript to request JSON data from the server. You’ll store data received from the server in an offline database using IndexedDB, which will create an app shell architecture. Finally, you’ll work to optimize your site to meet performance benchmarks, which you’ll test using Lighthouse.

Stage Two Rubric - [Stage 2 Rubric](https://review.udacity.com/#!/rubrics/1131/view)

Stage Two Development Server - [Stage 2 Server](https://github.com/udacity/mws-restaurant-stage-2)

## Project Overview: Stage 3

In **Stage Three**, you will take the connected application you built in Stage One and Stage Two and add additional functionality. You will add a form to allow users to create their own reviews. If the app is offline, your form will defer updating to the remote database until a connection is established. You'll also add functionality that allows users to favorite or unfavorite a restaurant. Finally, you’ll work to optimize your site to meet even stricter performance benchmarks than the previous project, and test again using Lighthouse.

Stage Three Rubric - [Stage 3 Rubric](https://review.udacity.com/#!/rubrics/1132/view)

Stage Three Development Server - [Stage 3 Server](https://github.com/udacity/mws-restaurant-stage-3)




Stage 3: how to run mws files

1) cd to client folder
` cd /Users/yourname/Desktop/mws-stage-3/client`
====
> 1. start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer. 

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with 
`python -m SimpleHTTPServer 8000`

(or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

> 2. With your server running, visit the site: `http://localhost:8000`, and look around for a bit to see what the current experience looks like.
====

2) cd to server folder to start the development local API Server
# cd /Users/yourname/Desktop/mws-stage-3/server
===
_Location of server = /server_
Server depends on [node.js LTS Version: v6.11.2 ](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/get-npm), and [sails.js](http://sailsjs.com/)
Please make sure you have these installed before proceeding forward.

Let's start with running commands in your terminal, known as command line interface (CLI)

###### Install project dependancies
```Install project dependancies
# npm i
```
###### Install Sails.js globally
```Install sails global
# npm i sails -g
```
###### Start the server
```Start server
# node server
```
===

### You should now have access to your API server environment
debug: Environment : development
debug: Port        : 1337

Now, Run:
`http://localhost:8000`







- Todo: watch Flexbox tutorial! https://scrimba.com/playlist/pL65cJ
- IDB resources: https://github.com/jakearchibald/idb use when user has network https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine

- issues: when refresh unfav does'nt stay line restaurant.html 44 follow the logic

Done: 
Does drop down form need lable for a11y?  does screen reader? 


Restaurant Reviews: Stage 3

Functionality

CRITERIA
MEETS SPECIFICATIONS
User Interface

Users are able to mark a restaurant as a favorite, this toggle is visible in the application. A form is added to allow users to add their own reviews for a restaurant. Form submission works properly and adds a new review to the database.

Offline Use

The client application works offline. JSON responses are cached using the IndexedDB API. Any data previously accessed while connected is reachable while offline. User is able to add a review to a restaurant while offline and the review is sent to the server when connectivity is re-established.

Responsive Design and Accessibility

CRITERIA
MEETS SPECIFICATIONS
Responsive Design

The application maintains a responsive design on mobile, tablet and desktop viewports. All new features are responsive, including the form to add a review and the control for marking a restaurant as a favorite.

Accessibility

The application retains accessibility features from the previous projects. Images have alternate text, the application uses appropriate focus management for navigation, and semantic elements and ARIA attributes are used correctly. Roles are correctly defined for all elements of the review form.

Performance

CRITERIA
MEETS SPECIFICATIONS
Site Performance

Lighthouse targets for each category exceed:

Progressive Web App: >90
Performance: >90
Accessibility: >90
