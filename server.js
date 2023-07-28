/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ryan Paul Domingo Student ID: 151918216 Date: 27 July 2023
*
*  Online (Cyclic) Link: https://concerned-shirt-duck.cyclic.app
*
********************************************************************************/ 


let express = require("express");
let HTTP_PORT = process.env.PORT || 8000;
let rye = express();
let path = require("path");
let collegeData = require("./modules/collegeData");
const { countReset } = require("console");
rye.use(express.urlencoded({ extended: true}));
const exphbs = require('express-handlebars');

rye.use(express.urlencoded({extended: true}));

rye.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: path.join(__dirname, 'views/layouts/main') }));
rye.set('view engine', 'hbs');


rye.use(function(req, res, next) {
    let route = req.path.substring(1);
    rye.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
  });

const hbs = exphbs.create({
    helpers: {
      navLink: function(url, options) {
        return '<li' + ((url == rye.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
               '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
      },

      equal: function(lvalue, rvalue, options) {

      }
    }
});

  
rye.engine('hbs', hbs.engine);  

collegeData.initialize()
    .then(() => {
        rye.get('/', (req, res) => {
            res.render('home');
          });
        
        rye.get('/students', (req, res) => {
            collegeData.getAllStudents()
              .then((data) => {
                res.render('students', { students: data });
              })
              .catch((err) => {
                res.render('students', { message: "no results" });
              });
          });

        rye.get('/students/add', (req, res) => {
            res.render('addStudent');
          });

        rye.post("/students/add", (req, res)=>{
            collegeData.addStudent(req.body)
            .then(()=>{
                res.redirect("/students")
            })
            .catch((error)=>{
                console.error(error)
                res.redirect('ERROR' + error);
            })
        })
        rye.post("/students/update", (req, res) => {
          collegeData
            .updateStudent({ studentNum: parseInt(req.body.studentNum), ...req.body })
            .then((updatedStudent) => {
              res.redirect("/students");
            })
            .catch((error) => {
              console.error(error);
              res.redirect("/students");
            });
        });
        
        rye.get("/tas", (req, res) => {
            collegeData.getTAs()
                .then((tas) => {
                    res.json(tas);
                })
                .catch((error) => {
                    res.status(404).json({ message: "no results" });
                });
        });
        
        rye.get('/courses', (req, res) => {
            collegeData.getCourses()
              .then((data) => {
                res.render('courses', { courses: data });
              })
              .catch((err) => {
                res.render('courses', { message: "no results" });
              });
        });

        rye.get('/courses/:id', (req, res) => {
            const courseId = req.params.id;
            collegeData.getCourseById(courseId)
              .then((course) => {
                res.render('course', { course });
              })
              .catch((err) => {
                res.render('course', { message: "no results" });
              });
        });
          
        
        rye.get('/students/:studentNum', (req, res) => {
            const studentNum = parseInt(req.params.studentNum);
        
            collegeData.getStudentByNum(studentNum)
                .then((student) => {
                    res.render('student', { student });
                })
                .catch((err) => {
                    res.render('student', { message: "no results" });
                });
        });

        rye.get("/theme.css", (req,res) => {
            res.sendFile(path.join(__dirname, "/css/theme.css"))
        });
        
        
        rye.get('/about', (req, res) => {
            res.render('about');
          });
        
        rye.get('/htmlDemo', (req, res) => {
            res.render('htmlDemo');
        });
        
        rye.use((req, res) => {
            res.status(404).send("Page Not Found");
        });


        rye.listen(HTTP_PORT, () => {
            console.log("Server listening on port: " + HTTP_PORT);
        });
    })
    .catch((error) => {
        console.error(error);
    });