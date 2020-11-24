var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var sanitizeHtml = require('sanitize-html');
var uuid = require('uuid');
module.exports = router;
const crypto = require('crypto');
router.use(favicon(path.join('favicon.ico')));
var multer = require('multer');
var upload = multer({ dest: './public/images/uploads' });
var fs = require('fs');
var validator = require('validator');

//google
//implement your own oauth id
const CLIENT_ID = 'xxx.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
//end google

//node mailer
var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    proxy: 'http://wdcmail.hopto.org',
    port: 587,
    auth: {
        user: 'alaina32@ethereal.email',
        pass: 'xebaDwgxH8WMHU4EZ2'
    }
});


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());


//handling avatars
router.post('/upload',upload.array('file',12));

router.post('/upload', function(req, res, next) {
    req.files.forEach(function(file){
        uploaded_images.push(file.filename);
    });
    res.send();

});

router.get('/imagelist',function(req,res,next){
    res.json(uploaded_images);
});


//end avatars



router.post('/emailLog', function(req, res, next) {

    var email = sanitizeHtml(req.body.email);
    var password = sanitizeHtml(req.body.password);


    //Connect to the database
    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        var query = "SELECT id,manager,email,pwordhash,pwordsalt,fullname,image,session_id FROM users WHERE email=?";

        connection.query(query, [email], function(err, users){
            if (err || users.length <= 0) {
                connection.release();
                res.status(401).send();
                return;
            }

            var hash = crypto.createHash('sha256');
            hash.update(password+users[0].pwordsalt);
            var submittedhash = hash.digest('hex');
            if(users[0].pwordhash===submittedhash){
                var query = "UPDATE users SET session_id = ? WHERE id = ?";
                connection.release();
                connection.query(query, [req.session.id,users[0].id]);
                res.send();
            } else {
                res.status(401).send();
            }
        });
    });

});



router.post('/logout', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) { throw err;}

        var query = "UPDATE users SET session_id = NULL WHERE session_id = ?";
        connection.release();
        connection.query(query, [req.session.id], function(err){
            if (err) {

                res.status(403).send();
            } else {
                res.send();
            }
        });

    });

});


/* GET task info. */
router.get('/tasks1.json', function(req, res, next) {
    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}
        var query="SELECT tasks.id,tasks.userid,tasks.name,tasks.description,tasks.days,tasks.complete,tasks.category,users.fullname FROM tasks INNER JOIN users ON tasks.userid = users.id"
        connection.release();
        connection.query(query, function(err,tasks){
                if (err) {
                    res.status(405).send();
                } else {

                    res.json(tasks);
                }

        });

    });

});


router.post('/newTask', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        var query = "SELECT manager FROM users WHERE session_id=?";

        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                // Not logged in
                connection.release();
                res.status(401).send();
                return;
            } else if (users[0].manager!==1) {
                // Not an manager user
                connection.release();
                res.status(403).send();
                return;
            }

            //new task
            var name = sanitizeHtml(req.body.name);
            var description = sanitizeHtml(req.body.description);
            var userid= sanitizeHtml(req.body.users);
            var days=sanitizeHtml(req.body.days);
            var category=sanitizeHtml(req.body.category);
            var query = "INSERT INTO tasks (name,userid,description,days,category) VALUES (?,?,?,?,?)";
            connection.release();
            connection.query(query, [name,userid,description,days,category], function(err){
                if (err) {

                    res.status(405).send();
                } else {
                    res.send();
                }
            });

        });

    });

});



router.post('/removeTask', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        var query = "SELECT manager FROM users WHERE session_id=?";

        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                // Not logged in
                connection.release();
                res.status(401).send();
                return;
            } else if (users[0].manager!==1) {
                // Not an manager user
                connection.release();
                res.status(403).send();
                return;
            }

            //delete the task
            var id = sanitizeHtml(req.body.id);
            var query = "DELETE FROM tasks WHERE id=?";
            connection.release();
            connection.query(query, [id], function(err){
                if (err) {
                    res.status(405).send();
                } else {
                    res.send();
                }
            });

        });

    });

});


router.post('/completeTask', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        var query = "SELECT manager FROM users WHERE session_id=?";

        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                // Not logged in
                connection.release();
                res.status(401).send();
                return;
            }

            //complete the task
            var id = sanitizeHtml(req.body.id);
            var query = "UPDATE tasks SET complete=1 WHERE id=?";
            connection.release();
            connection.query(query, [id], function(err){
                if (err) {
                    res.status(405).send();
                } else {
                    res.send();
                }
            });

        });

    });

});


router.post('/uncompleteTask', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        var query = "SELECT manager FROM users WHERE session_id=?";

        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                // Not logged in
                connection.release();
                res.status(401).send();
                return;
            }

            //uncomplete the task
            var id = sanitizeHtml(req.body.id);
            var query = "UPDATE tasks SET complete=0 WHERE id=?";
            connection.release();
            connection.query(query, [id], function(err){
                if (err) {
                    res.status(405).send();
                } else {
                    res.send();
                }
            });

        });

    });

});




router.post('/emailReg', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

            var name = sanitizeHtml(req.body.name);
            var email = sanitizeHtml(req.body.email);
            var password = sanitizeHtml(req.body.password);
            var cpassword= sanitizeHtml(req.body.cpassword);

            var isManage=req.body.isManager;
            var avatar='/images/001.png';
            var proceed=1;


            if(password.length==0||password!=cpassword||name.length==0||validator.isEmail(email)==0){
                proceed=0;

            }

            var pws = crypto.randomBytes(8).toString('hex');
			var hash = crypto.createHash('sha256');
			hash.update(password+pws);
			var pwh = hash.digest('hex');
			if(proceed==1){
            var query = "INSERT INTO users (manager,email,pwordhash,pwordsalt,fullname, image) VALUES (?,?,?,?,?,?)";
            connection.query(query, [isManage,email,pwh,pws,name,avatar], function(err){
                connection.release();
                if (err) {
                    res.status(405).send();
                } else {
                    res.send();
                }
            });

		}else{
		    res.status(400).send();
		}

    });
});


router.get('/profile.json', function(req, res, next) {
    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}
        var query = "SELECT id,manager,email,fullname,image,vegetable,livestock,office FROM users WHERE session_id=?";
        connection.release();
        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                res.status(401).send();
                return;
            }else{
              res.json(users);
            }




        });

    });

});


router.get('/users.json', function(req, res, next) {
    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}
        var query = "SELECT id,email,fullname,vegetable,livestock,office FROM users";
        connection.release();
        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                res.status(401).send();
                return;
            }else{
              res.json(users);
            }



        });

    });

});


router.post('/clearTasks', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}
        //are you an manager??
        var query = "SELECT manager FROM users WHERE session_id=?";

        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                // Not logged in
                connection.release();
                res.status(401).send();
                return;
            } else if (users[0].manager!==1) {
                // Not an manager user
                connection.release();
                res.status(403).send();
                return;
            }
            //end are you a manager

            //truncate the tables
            var query = "TRUNCATE TABLE tasks";
            connection.release();
            connection.query(query, function(err,users){
                if (err) {
                    res.status(405).send();
                } else {
                    res.send();
                }
            });


        });

    });

});


router.post('/saveProfile', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

            var name = sanitizeHtml(req.body.name);
            var email = sanitizeHtml(req.body.email);
            var isManage=sanitizeHtml(req.body.isManager);



            connection.query('UPDATE users SET manager = ?, fullname = ?, email = ? WHERE session_id=?', [isManage, name, email, req.session.id], function(err){
                connection.release();
                if (err) {
                    res.status(405).send();
                } else {
                    res.send();
                }
            });

    });
});


router.post('/newLeave', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        var query = "SELECT id,manager FROM users WHERE session_id=?";

        var days = sanitizeHtml(req.body.days);

        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                // Not logged in
                connection.release();
                res.status(401).send();
                return;
            } else {
                connection.query('INSERT INTO leaves (userid, leave_date) VALUES (?,?)', [users[0].id,days], function(err){
                    connection.release();
                if (err) {
                    res.status(405).send();
                }
            });
            }



        });

        function set_id(x){
            inputid=x;
        }

    });

});

router.get('/leaves.json', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        var query = "SELECT id,manager FROM users WHERE session_id=?";
        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                // Not logged in
                connection.release();
                res.status(401).send();
                return;
            } else {
                connection.query('SELECT id, leave_date FROM leaves WHERE userid=?', [users[0].id], function(err, users){
                    connection.release();
                    if (err || users.length <= 0) {
                res.status(401).send();
                return;
            }else{
              res.json(users);
            }
                });
            }

        });
    });

});



router.post('/removeLeaves', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        var query = "SELECT manager FROM users WHERE session_id=?";

        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                // Not logged in
                connection.release();
                res.status(401).send();
                return;
            }

            //delete the leaves
            var id = sanitizeHtml(req.body.id);
            var query = "DELETE FROM leaves WHERE id=?";
            connection.release();
            connection.query(query, [id], function(err){
                if (err) {
                    res.status(405).send();
                } else {
                    res.send();
                }
            });

        });

    });

});




router.post('/checkLeave', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}
        var userid = sanitizeHtml(req.body.userid);
        var query = "SELECT manager FROM users WHERE session_id=?";

        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                // Not logged in
                connection.release();
                res.status(401).send();
                return;
            } else if (users[0].manager!==1) {
                // Not an manager user
                connection.release();
                res.status(403).send();
                return;
            }else{
                connection.query('SELECT id, leave_date FROM leaves WHERE userid=?', [userid], function(err, users){
                    connection.release();
                    if (err || users.length <= 0) {
                res.status(401).send();
                return;
            }else{
              res.json(users);
            }
                });
            }

        });
    });

});

router.get('/allLeaves.json', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        var query = "SELECT id,manager FROM users WHERE session_id=?";
        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
                // Not logged in
                connection.release();
                res.status(401).send();
                return;
            } else {
                connection.query('SELECT * FROM leaves',  function(err, users){
                    connection.release();
                    if (err || users.length <= 0) {
                res.status(401).send();
                return;
            }else{
              res.json(users);
            }
                });
            }

        });
    });

});



router.post('/saveType', function(req, res, next) {

    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

            var vegetable = sanitizeHtml(req.body.vegetable);
            var livestock = sanitizeHtml(req.body.livestock);
            var office=sanitizeHtml(req.body.office);



            connection.query('UPDATE users SET vegetable = ?, livestock = ?, office = ? WHERE session_id=?', [vegetable,livestock,office, req.session.id], function(err){
                connection.release();
                if (err) {
                    res.status(405).send();
                } else {
                    res.send();
                }
            });

    });
});

router.post('/taskemail',function(req,res,next){
    caty="";
    if(req.body.category==1){
        caty="Vegetables";
    }else if(req.body.category==2){
        caty="Livestock";

    }else if(req.body.category==3){
        caty="Office";
    }

    let info=transporter.sendMail({
        from: "lelah.hills94@ethereal.email",
        to:req.body.to,
        subject:"You have a new task: "+req.body.tname,
        text:"You have a new task: " +req.body.tname+req.body.due,
        html:"<h1> You have a new task: " +req.body.tname+"</h1> <br><b><h2>Due: "+req.body.due+"</h2> <br><h2>Details: "+req.body.desc+"</h2><br><h2>Category: "+caty+"</b>"
    });
    res.send();
});

router.post('/gLog',async function(req,res,next){
    const ticket = await client.verifyIdToken({
      idToken: req.body.idtoken,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const name = payload['name'];
  const password = payload['sub'];
  const email = payload['email'];
  const avatar= payload['picture'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  console.log('signing in with googles');
  //Connect to the database
    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        var query = "SELECT id,manager,email,pwordhash,pwordsalt,fullname,image,session_id FROM users WHERE email=?";

        connection.query(query, [email], function(err, users){
            if (err || users.length <= 0) {
                connection.release();
                res.status(401).send();
                return;
            }

            var hash = crypto.createHash('sha256');
            hash.update(password+users[0].pwordsalt);
            var submittedhash = hash.digest('hex');
            console.log(submittedhash);
            if(users[0].pwordhash===submittedhash){
                var query = "UPDATE users SET session_id = ? WHERE id = ?";
                connection.release();
                connection.query(query, [req.session.id,users[0].id]);


                res.send();

            } else {
                console.log('wrong pass');
                res.status(401).send();
            }
        });
    });



  res.send();
});





router.post('/gReg',async function(req,res,next){
        const ticket = await client.verifyIdToken({
      idToken: req.body.idtoken,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const name = payload['name'];
  const password = payload['sub'];
  const email = payload['email'];
  const avatar= payload['picture'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  //Connect to the database
  console.log('REGISTER with googles');
    req.pool.getConnection( function(err,connection) {
        if (err) { throw err;}

        if (err) { throw err;}

        var query = "SELECT manager FROM users WHERE session_id=?";

        connection.query(query, [req.session.id], function(err, users){
            if (err || users.length <= 0) {
            var isManage=0;


            var pws = crypto.randomBytes(8).toString('hex');
			var hash = crypto.createHash('sha256');
			hash.update(password+pws);
			var pwh = hash.digest('hex');


            var query = "INSERT INTO users (manager,email,pwordhash,pwordsalt,fullname, image) VALUES (?,?,?,?,?,?)";
            connection.query(query, [isManage,email,pwh,pws,name,avatar], function(err){
                connection.release();
                if (err) {
                    res.status(405).send();
                    console.log(err);
                } else {

                    res.send();

                }
            });

                return;
            }
       });
    });
    res.redirect('/roster.html');
});