const fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

function addStudent(studentData){
    return new Promise ((resolve, reject) => {
        if (typeof studentData.TA === "undefined") {
            studentData.TA = false;
        } else {
            studentData.TA = true;
        }

        studentData.studentNum = dataCollection.students.length + 1;

        dataCollection.students.push(studentData);
        resolve()
    });
}

module.exports.addStudent = addStudent;


module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
      if (dataCollection.students.length == 0) {
        reject("query returned 0 results");
        return;
      }
      resolve(dataCollection.students);
    });
  };

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourseById = function (courseId) {
    return new Promise((resolve, reject) => {
      var courseFind = dataCollection.courses.find((course) => course.courseId === parseInt(courseId));
  
      if (courseFind) {
        resolve(courseFind);
      } else {
        reject("No course found with the given courseId");
      }
    });
  };

  module.exports.getAllStudentsWithPromise = function () {
    return new Promise((resolve, reject) => {
      if (dataCollection.students.length == 0) {
        reject("query returned 0 results");
        return;
      }
      resolve(dataCollection.students);
    });
  };
  




  module.exports.updateStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
      var studentToUpdate = dataCollection.students.find((student) => student.studentNum === parseInt(studentData.studentNum));
  
      if (!studentToUpdate) {
        reject("Student not found");
        return;
      }
  
      studentToUpdate.firstName = studentData.firstName;
      studentToUpdate.lastName = studentData.lastName;
  
      saveStudentsToFile();
  
      resolve(studentToUpdate);
    });
  };

  function saveStudentsToFile() {
    fs.writeFile("./data/students.json", JSON.stringify(dataCollection.students, null, 2), (err) => {
      if (err) {
        console.error("Error saving students data to file:", err);
      } else {
        console.log("Students data saved to file successfully.");
      }
    });
  }

  module.exports.saveStudentsToFile = saveStudentsToFile; 