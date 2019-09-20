# FeMo



## Getting started

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required. 

To get the Node server running locally:

- Clone this repo
  - `$ git clone https://github.com/desert-eagles/FeMo.git`
- Install the dependencies in the local node_modules folder using the 
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
  - ```$ npm install```
- Download the `.env` file containing sensitive configuration settings
  - [google drive](https://drive.google.com/open?id=184rEZQvnii4C2CiymjsuBRFgIWS6Iz0I)
- Start the local server
  - ```$ npm start```
  
  
## Code Overview

### Dependencies

- [bcrypt](https://www.npmjs.com/package/bcrypt) - A library to help in hashing passwords
- [body-parser](https://www.npmjs.com/package/body-parser) - Parse incoming request bodies in a middleware before the handlers
- [cloudinary](https://www.npmjs.com/package/cloudinary) - Cloud service that offers a solution to a web application's entire image management pipeline
- [connect-mongo](https://www.npmjs.com/package/connect-mongo) - MongoDB session store for Connect and Express
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) - Parse HTTP request cookies
- [debug](https://www.npmjs.com/package/debug) - Small debugging utility
- [dotenv](https://www.npmjs.com/package/dotenv) - Load environment variables from `.env` file
- [express](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-session](https://www.npmjs.com/package/express-session) - Session middleware for `Express`
- [http-errors](https://www.npmjs.com/package/http-errors) - Create HTTP error objects
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for `Express`
- [multer](https://www.npmjs.com/package/multer) - Middleware for handling `multipart/form-data`
- [multer-storage-cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary) - A cloudinary multer storage engine
- [nodemailer](https://www.npmjs.com/package/nodemailer) - Send emails from Node.js
- [pug](https://www.npmjs.com/package/pug) - Clean, whitespace-sensitive template language for writing HTML
- [serve-favicon](https://www.npmjs.com/package/serve-favicon) - Favicon serving middleware with caching


### Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `routes/` - Contains the route definitions for our API.
- `controllers/` - Defines our app route handlers and contains their logic.
- `models/` - Contains the schema definitions for our Mongoose models.
- `public/` - Stores static images custom JavaScript files and CSS.
- `views/` - Contains templates to be rendered by the server.
- `package.json` - Takes care of the dependencies and the scripts to run with the npm command.
