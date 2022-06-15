# WELCOME T0 MY BACKEND PROJECT

## An API that serves endpoints for a front end that will mimic the functionality of news applications, such as Reddit!

## Overview

As a part of my studies at Northcoders, I was tasked with building an API for the purpose of accessing application data programmatically. The intention is to mimic the building of a real world backend service, gaining practical insight into the required workflows that will be common in the workplace.

This API is hosted on Heroku, and can be viewed online using this URL - https://andrews-fe-project.herokuapp.com/
Alternatively, if you would like to run the test suite locally, please follow the setup instructions.

## Setup

What versions are needed: Node (version 16 or above), PostgreSQL (version 12 or above)

After cloning the repo, first install the project's dependencies:

npm install

This repo contains 2 databases for test and dev data. In order to connect to the two databases, .env files must be created. In the root directory, create a .env.test file, and include the following:

PGDATABASE=nc_news_test

Next, create a .env.development file, and include the following:

PGDATABASE=nc_news

The jest test suite can now be run using npm test!

Additionally, if you wanted to view the test database, you can run:

npm run view-data

Which will print the test data to a "testdata.txt" file.

THATS ALL!

THANK YOU FOR YOU TIME, AND ALWAYS NICE TO SEE YOU HERE :)
