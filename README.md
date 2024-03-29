# GroListy
A Full-Stack Grocery List Web Application. Created to track your groceries in a list. 

## How I worked on this project
My goal was to create a full-stack web application with simple functionality that provides a great user exprience.
  * I worked with tasks on a Trello board to keep myself on track.
  * I created a requirements document to outline specific user requirements for the app.
  * I built the app using the MERN stack: MongoDB, Express, React, Node.

## What I have learned
I learned lots of valuable skills in full-stack web development using JavaScript.
  * I used the MERN stack, and understood how each of the different technologies interact with other in a full-stack environment.
  * I learned how to utilize the useReducer hook in React, as well as how to update the context of an application.
  * I gained experience building and consuming REST APIs that perform CRUD operations.
  * I learned how to use Postman to test API endpoints.
  * I added error handling to the item form and implemented useful error messages to display to the user.
  * I learned how to organize my components, pages and contexts into different files and folders and how to seperate the front-end and back-end of the app.
  * I utilized the 60-30-10 color rule with CSS to improve the user interface's design.
  * I designed a database schema that each item being stored must follow in MongoDB's Atlas Database by using the ```mongoose``` library in [groceryModel](./backend/models/groceryModel.js).
  * I added user authentication by using JSON Web Tokens, bcrypt and validator. I included security for the log in and sign up pages.  
  * I created a Receipt OCR feature that allows users to automatically log items based on a receipt image used as input. It uses Tesseract.js optical character recognition to extract SKU numbers, then Puppeteer headless browsing to retrieve key product information from vendors to add to the user's grocery list.

## Future Improvements
Once I have enough time to continue working on this project, these are the primary changes and improvements I will make to the web app:
  * Add expiration date as a key piece of information that is stored in a seperate system that tracks and notifies the user to throw out expired goods and buy new groceries.

## Dependencies
  * react
  * react-router-dom
  * node
  * express
  * nodemon
  * mongoose
  * dotenv
  * date-fns
  * bcrypt
  * validator
  * jsonwebtoken
  * tesseractjs
  * puppeteer
