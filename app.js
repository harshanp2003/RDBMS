// IMPORTANT NOTES:
// XAMPP,VS CODE
// npm init: to initiallise package
// nom install: to install all dependencies ie express,body_parser->for taking data from forms and databases and acting as a midware
// nodmon: development dependency->server connection->automatically
// npm start: to start the node app.js and listen to port 5000
// app.get: to see the data in the database
// app.post: to send data to database
//  all images are to be kept in  folder piblic/images 
//  href can have only routes ie. /..... 
//  all images with src=/images/filename
//
//
//
//
//
//
// 
//
//

// all import statements

import express, { request } from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

//environment port number -> in this case 5000
const app = express();
const port = process.env.PORT || 5000;

//parsing Middleware
//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//parse application/json
app.use(bodyParser.json());

//Static Files
app.use(express.static('public'));

//Connection Pool to Mysql using PhpMyAdmin(XAMPP) Interface 
const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'myadmin',
    password: 'Adi#thya12',
    database: 'vmds'
});


//Front page
app.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }
        connection.release(); // Release the connection
            if (!err) {
                res.render('front.ejs');
            } else {
                console.error('Error executing query:', err.message);
            }
        });
});

//Login page
app.get('/index', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }
        connection.release(); // Release the connection
            if (!err) {
                res.render('index1.ejs');
            } else {
                console.error('Error executing query:', err.message);
            }
        });
});


//Customer Page
app.get('/customer', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }

        console.log('Connected as ID ' + connection.threadId);
        connection.query('SELECT * FROM customer', (err, rows) => {
        connection.release(); // Release the connection

            if (!err) {
                res.render('customer.ejs', { rows });
            } else {
                console.error('Error executing query:', err.message);
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});


//Search box in Customer Page:

app.post('/search', (req, res) => {
    let searchTerm = req.body.value; // Assuming you are using Express and extracting the value from the request body

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        //SQL Query for search Pattern Matching
        connection.query('SELECT * FROM customer WHERE customer_name LIKE ? OR customer_ID LIKE ? OR contact_number LIKE ? OR DOB LIKE ? OR address LIKE ?OR emailID LIKE ?',['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'], (err, rows) => {
            connection.release();

            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            console.log("The data from customer table:\n", rows);
            res.render('customer.ejs', { rows });
        });
    });
});

// + Customer button in Customer Page :

pool.getConnection((err, connection) => {
    if (err) throw err;   //Error msg if not connected
    console.log('Connected as ID ' + connection.threadId);
        if (!err) {
            //res.render('home.ejs',{ rows });
            app.get('/addcustomer', (req, res) => {
            res.render('addcustomer.ejs');
            });
        }
        else {
            console.log(err);
        }
});

app.post('/addcustomer', (req, res) => {
 const {customer_name,contact_number,DOB,address,emailID} = req.body;
 pool.getConnection((err,connection) => {
    if (err) throw err;   //Error msg if not connected
    console.log('Connected as ID ' + connection.threadId);

    connection.query('INSERT INTO customer SET customer_name=?,contact_number=?,DOB=?,address=?,emailID=?',[customer_name,contact_number,DOB,address,emailID],(err, rows) => {

        connection.release();
           if (!err) 
           {
            res.redirect('/customer');
            }
            else 
            {
            console.log(err);
            }
        console.log('Data Fetched from Form');
     
    });
  }); 
});

//Edit Customer in Customer Page: 
app.get('/editcustomer/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }
        console.log('Connected as ID ' + connection.threadId);
        connection.query('SELECT * FROM customer WHERE customer_id=?',[req.params.id], (err, rows) => {
        connection.release(); // Release the connection

            if (!err) {
                res.render('editcustomer.ejs', { rows });
            } else {
                console.error('Error executing query:', err.message);
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});

//Update Customer Action on Clicking Submit Button:
app.post('/updatecustomer/:id', (req, res) => {
    const {customer_name,contact_number,DOB,address,emailID} = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }
        console.log('Connected as ID ' + connection.threadId);
        connection.query('UPDATE customer SET customer_name=?,contact_number=?,DOB=?,address=?,emailID=? WHERE customer_ID=?',[customer_name,contact_number,DOB,address,emailID,req.params.id], (err, rows) => {
        connection.release(); // Release the connection

            if (!err) {
                res.redirect('/customer');
            } else {
                console.error('Error executing query:', err.message);
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});


//View Option On Customer Page
app.get('/viewcustomer/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }
        console.log('Connected as ID ' + connection.threadId);
        connection.query('SELECT * FROM customer WHERE customer_id=?',[req.params.id], (err, rows) => {
        connection.release(); // Release the connection

            if (!err) {
                res.render('viewcustomer.ejs', { rows });
            } else {
                console.error('Error executing query:', err.message);
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});

// Delete Customer On Customer Page:
app.get('/deletecustomer/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            res.status(500).send('Internal Server Error'); // Send an error response to the client
            return;
        }

        console.log('Connected as ID ' + connection.threadId);

            connection.query('DELETE FROM customer WHERE customer_id = ?', [req.params.id], (err, rows) => {
            connection.release(); // Release the connection

            if (!err) {
                console.log('Customer deleted successfully');
                res.redirect('/customer');
            } else {
                console.error('Error executing query:', err.message);
                res.status(500).send('Internal Server Error'); // Send an error response to the client
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});


//Employee Page
app.get('/employee', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }

        console.log('Connected as ID ' + connection.threadId);
        connection.query('SELECT * FROM employee', (err, rows) => {
        connection.release(); // Release the connection

            if (!err) {
                res.render('employee.ejs', { rows });
            } else {
                console.error('Error executing query:', err.message);
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});

//Team Page
app.get('/team', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }

        console.log('Connected as ID ' + connection.threadId);
        connection.query('SELECT * FROM team', (err, rows) => {
        connection.release(); // Release the connection

            if (!err) {
                res.render('team.ejs', { rows });
            } else {
                console.error('Error executing query:', err.message);
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});

//Search Box in Team Page
app.post('/searchteam', (req, res) => {
    let searchTerm = req.body.value; // Assuming you are using Express and extracting the value from the request body

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        //SQL Query for search Pattern Matching
        connection.query('SELECT * FROM team WHERE team_name LIKE ? OR team_ID LIKE ? OR bay_no LIKE ? OR mng_start_date LIKE ?',['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'], (err, rows) => {
            connection.release();

            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            console.log("The data from customer table:\n", rows);
            res.render('team.ejs', { rows });
        });
    });
});

//Add Team
pool.getConnection((err, connection) => {
    if (err) throw err;   //Error msg if not connected
    console.log('Connected as ID ' + connection.threadId);
        if (!err) {
            //res.render('home.ejs',{ rows });
            app.get('/addteam', (req, res) => {
            res.render('addteam.ejs');
            });
        }
        else {
            console.log(err);
        }
});

app.post('/addteam', (req, res) => {
 const {team_name,bay_no,mng_start_date} = req.body;
 pool.getConnection((err,connection) => {
    if (err) throw err;   //Error msg if not connected
    console.log('Connected as ID ' + connection.threadId);

    connection.query('INSERT INTO team SET team_name=?,bay_no=?,mng_start_date=?',[team_name,bay_no,mng_start_date],(err, rows) => {

        connection.release();
           if (!err) 
           {
            res.redirect('/team');
            }
            else 
            {
            console.log(err);
            }
        console.log('Data Fetched from Form');
     
    });
  }); 
});


//Edit Team in Team Page: 
app.get('/editteam/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }
        console.log('Connected as ID ' + connection.threadId);
        connection.query('SELECT * FROM team WHERE team_id=?',[req.params.id], (err, rows) => {
        connection.release(); // Release the connection

            if (!err) {
                res.render('editteam.ejs', { rows });
            } else {
                console.error('Error executing query:', err.message);
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});

//Update Team Action on Clicking Submit Button:
app.post('/updateteam/:id', (req, res) => {
    const {team_name,bay_no,mng_start_date} = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }
        console.log('Connected as ID ' + connection.threadId);
        connection.query('UPDATE team SET team_name=?,bay_no=?,mng_start_date=? WHERE team_ID=?',[team_name,bay_no,mng_start_date,req.params.id], (err, rows) => {
        connection.release(); // Release the connection

            if (!err) {
                res.redirect('/team');
            } else {
                console.error('Error executing query:', err.message);
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});

//View Option On Customer Page
app.get('/viewteam/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }
        console.log('Connected as ID ' + connection.threadId);
        connection.query('SELECT * FROM team WHERE team_id=?',[req.params.id], (err, rows) => {
        connection.release(); // Release the connection

            if (!err) {
                res.render('viewteam.ejs', { rows });
            } else {
                console.error('Error executing query:', err.message);
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});

// Delete Team On Team Page:
app.get('/deleteteam/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            res.status(500).send('Internal Server Error'); // Send an error response to the client
            return;
        }

        console.log('Connected as ID ' + connection.threadId);

            connection.query('DELETE FROM team WHERE team_id = ?', [req.params.id], (err, rows) => {
            connection.release(); // Release the connection

            if (!err) {
                console.log('Customer deleted successfully');
                res.redirect('/team');
            } else {
                console.error('Error executing query:', err.message);
                res.status(500).send('Internal Server Error'); // Send an error response to the client
            }

            console.log("The data from customer table:\n", rows);
        });
    });
});

// code to get the response and to render a page
// app.get('/',(req,res)=>{
//     res.render('home.ejs');
// });

app.listen(port, () => console.log(`Listening on port ${port}`));


