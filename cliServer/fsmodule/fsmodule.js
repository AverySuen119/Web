const os = require('os');
const fs = require('fs');

var user = os.userInfo();

var data = "\hello " ; 

fs.appendFile('file.txt',data + user.username + "\n",'utf8',
    // callback function
    function(err) {     
        if (err) throw err;
        // if no error
        console.log("Successful")
});