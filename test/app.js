var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sr20031228.",
    database: "testDB",
    port: 3306
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


//con.query('SELECT * FROM Persons', (err,rows) => {
  //  if(err) throw err;
    //console.log('Data received from Db:');
    //console.log(rows);
    //rows.forEach( (row) => {
     // console.log(`${row.name} lives in ${row.city}`);
  //})
  //});

  const person = { id: 34, name: 'Wendy', suburb: 'Burwood', city: 'Seoul' };
con.query('INSERT INTO Persons SET ?', person, (err, res) => {
  if(err) throw err;
  console.log('Last insert ID:', res.insertid);
});