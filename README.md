# ShareIt

ShareIt is a web app that allows users to borrow products from people nearby. It was built in 3 weeks as the final group project of CodeOp's Full Stack Development Bootcamp.

Technologies used: React, Node/Express, Sequelize, MySQL, Tailwind CSS and more!

See the app live on Heroku: https://shareitapp.herokuapp.com/

## Features

- Create a profile and upload photos of products you want to lend out
- Find a product to borrow by using the search bar or filters
- Use your location to sort products by distance from you
- Check availability on the calendar and reserve dates to borrow a product
- Chat with other users to discuss the details of the exchange
- Buy extra credit to borrow products through PayPal

## Installation

### Dependencies

Run `npm install` on the root folder to install dependencies related to Express.

`cd client` and run `npm install` to install dependencies related to React.

### Database Prep

Create a database in MySQL.

Create an `.env` file in the project directory and add your db credentials:

```
DB_HOST=localhost
DB_USER=root
DB_NAME=YOUR_DATABASE
DB_PASS=YOUR_PASSWORD
```

Run `npm run migrate` in the project directory to create the tables.
Run `npm run seed` in the project directory to add seed data to the tables.

### JWT

JSON Web Tokens are used for user authorization. A secret string is used to sign the tokens.

Add your secret to the `.env` file:

```
SUPER_SECRET=YOUR_SECRET
```

### Pusher

Pusher API is used to enable realtime messaging.

1. Get a key by creating a free account at https://pusher.com/.
2. Go to your dashboard and click on "Create New App".
3. Go to "App Keys", copy your keys and add to your `.env` file in the project folder:

```
PUSHER_APP_ID=******
PUSHER_KEY=*******************
PUSHER_SECRET==*******************
```

4. Create another `.env` file in the client folder and add the key there as well (prefixed by REACT_APP):

```
REACT_APP_PUSHER_KEY=*******************
```

### Google Maps

Google Maps API is used for geocoding to calculate distances and displaying locations on the map.

1. Get a key here: https://developers.google.com/places/web-service/get-api-key
2. Add the key to the `.env` file in the client folder (prefixed by REACT_APP):

```
REACT_APP_GOOGLE_API_KEY=**********
```

### Firebase

- Connect to or create a Firebase account here: https://firebase.google.com
- Create a new project and click on 'Storage' and then on 'Start'.
- Select your bucket's rules and the location of your data (one that is close to where you are). 
- Click on the settings button at the top of the left menu and and select "Service accounts". 
- Click on “Generate new private key”. This will generate and download a JSON file with all the Firebase keys. Store this file in your project but make sure to add it to the `.gitignore` file so it's not commited to the remote repository. 
- Add the following environment variables to the `.env` file in the root folder:

```
GCLOUD_PROJECT_ID: (your firebase project ID)
GCLOUD_APPLICATION_CREDENTIALS: (path to your firebase JSON file)
GCLOUD_STORAGE_BUCKET_URL: [YOUR_GCLOUD_PROJECT_ID].appspot.com
```

### Development

- Run `npm start` in the project directory to start the Express server on port 5000.
- `cd client` and run `npm run dev` to start the client server in development mode with hot reloading in port 3000 and watch changes to recompile Tailwind if necessary.
- Client is configured so all API calls will be proxied to port 5000.

Test the frontend on http://localhost:3000/ and the backend on http://localhost:5000/.

## Database Schema

![Database Schema](/db_schema.png)

_This is a student project that was created at [CodeOp](http://codeop.tech), a full stack development bootcamp in Barcelona._
