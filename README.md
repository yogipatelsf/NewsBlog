# newspro
a web app that lets users view and leave comments on the latest news.


Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

Getting Started
These instructions will get you a copy of the project up and running on your local machine for development. I will assume that you already have Node.js and MongoDB installed locally. See deployment for notes on how to deploy the project on a live system.

Install dependencies
In your CLI, enter mongod
In a new CLI window, go to root of directory and enter node server.js
In browser, navigate to http://localhost:3000
Dependencies
You will need to npm install the following node modules:

express
express-handlebars
mongoose
body-parser
cheerio
request
Since I have included a package.json file, you do not need to install dependencies by name. Simply run the following in the root of your directory:

npm install
Deployment
Follow these instructions to deploy your app live on Heroku

Create a heroku app in your project directory

heroku create <projectName>
Provision mLab MongoDB add-on for your project

heroku addons:create mongolab
Now your project should be successfully deployed on heroku.
