# Banana Photo Store

This is a webpage that is hosted on [Heroku](https://bps-frontend.herokuapp.com/) as a NodeJs application, that connects to this backend server: [BPS Back-end](https://github.com/mksiq/bsp-back).

### It is not real web-store. It is simple a project to make it easier to see the Back-End application working.

## About
One user may sign up and logi n. Authentication and authorization is controlled by the Java server using JWT. The session is managed by express-session.

The user may upload their pictures, and 'buy' other user's pictures that are stored in transactions. Users may keep track of bought and sold pictures.

The file uploaded is done by express and stores the picture temporarily in the front end server before sending it to the backend server that reduces the size and uploads it to AWS S3 Storage. If the user selects a file very large the backend server may time out because it will require more run than what was made available to Heroku's dyno.

The design is fully done by using Bootstrap with minimal customization.

### Copyright
The only image that was created by me was the banana logo. All other images uploaded were downloaded from [Unsplash](https://unsplash.com/)