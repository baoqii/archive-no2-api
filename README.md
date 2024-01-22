# Archive No.2 API

Archive No.2 API is a RESTful API created with Node.js and Express, providing essential functionality for managing blog posts, comments, and user authentication.

## Features 
- A straightforward and adaptable API facilitating effortless interaction with your blog's data.
- Enables CRUD (Create, Read, Update, Delete) actions for posts, comments, and tags.
- Authentication and authorization measures to ensure restricted access for authorized users.
- Robust error handling and validation mechanisms to guarantee the accuracy and security of your data.

## Endpoints
| Endpoint | Method | Description |
| --- | --- | --- |
| /login | POST | Login as user |
| /signup | POST | Create a new user account |
| /check-token | GET | Check session token validity |
| /posts/all | GET | Retrieve all posts |
| /posts/unpublished | GET | Retrieve all unpublished posts (admin only) |
| /posts/:post_id | GET | Retrieve a specific post by ID |
| /posts/new-post | POST | Create a new post |
| /posts/:post_id | DELETE | Delete an existing post by ID |
| /posts/:post_id | PUT | Update an existing post by ID |
| /posts/:post_id/comments| GET | Retrieve all comments under a specific post |
| /posts/:post_id/new-comment| POST| Create a new comment under a specific post |
| /posts/:post_id/:comment_id| DELETE| Delete a specific comment under a post |
| /tags | GET | Retrieve all tags |
| /tags/:tag_id | GET | Retrieve all posts under an existing tag |
| /tags/new-tag | POST | Create a new tag |
| /tags/:tag_id | DELETE | Delete a specific tag by ID |
| /tags/:tag_id | PUT | Update a specific tag by ID |

## Content Management System
The Content Management System (CMS) allows for an efficient management of blog posts and comments. The source code for the Content Management System can be found at https://github.com/baoqii/archive-no2-admin

## Client
The codebase for the frontend of the blog client is accessible on https://github.com/baoqii/archive-no2-client 

## Installation 
1. Clone the repository to your local machine
2. Install the required dependencies: `npm install`
3. Start the development server: `npm run dev`

## Environment Variables
- MONGODB_URI: The URI for the MongoDB database
- SECRETKEY_TOKEN: The secret key for JWT Authentication
- TOKEN_EXPIRESIN: How long the JWT is valid for
- ALLOWED_ORIGINS: Trusted domains separated by comma

## Usage
1. Setup .env with the environment variables defined above. 
2. Utilize your preferred tool or library (such as Postman) to initiate HTTP requests to the API endpoints.
3. Authenticate your requests accordingly by incorporating JSON Web Tokens as necessary.
4. Create, retrieve, update, and delete data as necessary.

## Dependencies
- [Async](https://caolan.github.io/async/v3/) - A library aiding in managing asynchronous operations effectively.
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs) - A library optimized for JavaScript, specifically tailored for password hashing.
- [Compression](https://github.com/expressjs/compression) - A middleware designed for compressing HTTP responses.
- [Cookie-Parser](https://github.com/expressjs/cookie-parser) - A middleware dedicated to parsing HTTP cookies.
- [Cors](https://github.com/expressjs/cors) - A middleware facilitating Cross-Origin Resource Sharing.
- [Dotenv](https://github.com/motdotla/dotenv) - A module with zero dependencies, responsible for loading environment variables from a .env file.
- [Express](https://expressjs.com/) - A Node.js framework used for building the API.
- [Express-Validator](https://github.com/express-validator/express-validator) - A set of express.js middlewares wrapping validator.js functions for validation and sanitization.
- [Http-errors](https://www.npmjs.com/package/http-errors) - A module focused on handling HTTP errors.
- [Helmet](https://helmetjs.github.io/) - A collection of middlewares specializing in managing HTTP headers.
- [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - A library for handling JSON Web Tokens (JWT).
- [Luxon](https://www.npmjs.com/package/luxon) - A library providing comprehensive date and time manipulation capabilities. 
- [Mongoose](https://mongoosejs.com/) - An Object Data Modeling (ODM) library for MongoDB.
- [Morgan](https://github.com/expressjs/morgan) - A middleware employed for logging HTTP requests.
- [Passport](http://www.passportjs.org/) - An authentication middleware for Node.js.
- [Passport-Jwt](https://github.com/mikenicholson/passport-jwt) - A Passport strategy dedicated to authenticating with JSON Web Tokens (JWT).
- [Passport-Local](https://github.com/jaredhanson/passport-local) - A Passport strategy designed for authentication using a username and password.

