[![Build Status](https://travis-ci.org/LABS-EU3/Student-Art-Collection-BACKEND.svg?branch=master)](https://travis-ci.org/LABS-EU3/Student-Art-Collection-BACKEND)

#### Link to frontend documentation https://github.com/LABS-EU3/Student-Art-Collection-FRONTEND

# Art-funder

You can find the deployed project at https://art-funder.com/

## Contributors

Check our about page at https://art-funder.com/about (WIP)

## Project Overview

[Trello Board] https://trello.com/b/iVfh4Fx5/student-art-collection

[Product Canvas] https://www.notion.so/EU3-Student-Art-Collection-a336d464508d434f9ce1dafc6b478d93

[UX Design files] https://www.figma.com/file/6759R02Mdf6uoRhpZFNQJ8/Desktop-Design?node-id=0%3A1

Art-funder is an platform that allows art schools to raise funds through the sale of art online produced by their students. 

### Key Features

- Create your buyer or school accounts with email and password or Google login
- Schools:
    - Upload art
    - Manage inventory
    - See orders
- Buyer:
    - Buy art (collection at school for now)
    - See past orders
- No need to create account to browse art on sale

## Tech Stack

Node.js, Express framework, MongoDB with Mongoose ODM, JWT, Nodemailer, Bcrypt, Cloudinary, Jest, Supertest

## Getting started

To get the server running locally:

- Clone this repo
- **npm install** to install all required dependencies
- **npm start** to start the local server
- **npm run start:dev** to start the local server with nodemon
- **npm test** to start server using testing environment

# Back-end

We use Node.js and it's Express framework to build the server and APIs. For the chat app, we use Socket.IO.

- [**Node.js**](https://nodejs.org/en/) is a JavaScript runtime build on Chrome's V8 engine. Being an interface to the V8 JavaScript runtime, it enables super fast JavaScript interpreter that runs in the Chrome browser. Its non-blocking I/O model is ideal for real-time applications, like chats, even tho it is single threaded. Event loop takes care of all the asynchronous I/O operations without blocking synchronous tasks. That means actions like reading or writing to the database, or network requests can be performed very quickly and not block the process.

- [**Express.js**](https://expressjs.com/) is a flexible Node.js framework that provides robust set of features for web and mobile applications. The pleathora of HTTP utility methods and middleware available allows us to quickly create robust API.

## Database

### **MongoDB**

MongoDB is a cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with schema. MongoDB is developed by MongoDB Inc. and licensed under the Server Side Public License (SSPL).

We started with comparing SQL vs NoSQL. We choose MongoDB for our project because the group was not familiar with this technology and we wanted to challenge ourselves to learn something new.

### **Mongoose**

Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

Mongoose is perhaps the most popular and used promised base Javascript MongoDB ORM.

## APIs query type

### **Rest API**

REST API is a simple and popular architecture type both for client and server-side that helps us perform all CRUD operations. Since REST was covered in the curriculum and also effectively solves our problem in the early circle we would be starting with it.

## Testing

### **Jest Framework**

Jest is a testing framework that focuses on simplicity. It was covered in the curriculum, have awesome documentation and practically covers every aspect of testing; from unit-test to snap-shot test, etc.

Jest have both units test, snap-shot test and react test. It's also simple and simply delightful.

## **Continous Integration**

Using continuous integration for our test helps us deploy our application dynamically, supports our development process by automatically building and testing code changes, providing immediate feedback on the success of the change.

### **Travis CI**

Circle CI is a fast automated triggered continuous integration service.

Circle CI has a hub and automate all process of automated integration, from base to end. Automatically deploy to heroku, etc.

## Hosting & Environments

### **Heroku - Production**

Heroku is a cloud platform as a service (PaaS) supporting several programming languages. We chose Heroku over other providers for its simplicity (you can get a server up and running in few clicks).

# Environment Variables

In order for the app to function correctly, the user must set up their own environment variables. There should be a .env file containing the following:

```
MONGODB_URI
API_KEY
API_SECRET
JWT_Secret'
USER_MAIL
PASSWORD_MAIL
GOOGLE_CLIENT_SECRET
GOOGLE_CLIENT_ID
CLOUD_NAME
FRONT_END
FRONTEND_BASE_URL
```

## Endpoints

https://documenter.getpostman.com/view/8733024/SWT7DL6j?version=latest

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).
