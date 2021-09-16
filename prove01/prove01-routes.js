const fs = require('fs'); 
const express = require('express'); 
const router = express.Router();

//global users array to collect the usernames
const users = [];

const requestHandler = (req, res) =>{

    const url = req.url; //get the url for routing purposes
    const method = req.method; // get the method for routing purposes

    // Main page with the input and submit, after submit will process via /create-user url
    if (url === '/') {
        res.write('<html>');
        res.write('<body>');
        res.write('<h2>Hey All, this is a Greeting message!</h2>');
        res.write('<form action="/create-user" method="POST"><p>Username:<input type="text" name="username"><button type="submit">Send</button></p></form>')
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }
    
    // this just processes the info and stores the username in the users array and redirects to the list.
    if (url ==='/create-user' &&  method == 'POST') {
        const body = [];
        
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk)
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const user = parsedBody.split('=')[1];
            users.push(user);
            res.statusCode = 302;
            res.setHeader('Location', '/users');
            console.log(parsedBody);
            console.log("This is what is in the array now:  " + users );
            res.end();
        });
    }

    // This page is for the list of users that is stored. 
    if (url ==='/users') {
        res.write('<html>');
        res.write('<body>');
        res.write('<h1>List of users:</h1>')
        res.write('<ul>');

        //loops through each of the users stored in the user array.
        users.forEach(user => {
            res.write('<li>' + user + '</li>')
        });

        res.write('</ul>');
        res.write('<a href="/">Add another user.</a>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }
};

//export to use in the prove01.js file
module.exports = requestHandler;
