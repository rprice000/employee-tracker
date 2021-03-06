// Added Dependencies to application
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Added Port Number for application
const PORT = process.env.PORT || 3001;
const app = express();
// Added Express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Added connection to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db',
  });

// Displays if user connects to data otherwise gives error
  db.connect(err => {
    if (err) throw err;
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*    EMPLOYEE TRACKER DATABASE    *")
    console.log("*                                 *")
    console.log("***********************************")
    accessEmployeeTracker();
  });

// Inquirer Prompt to ask user what they want to do to employee_tracker database
  const accessEmployeeTracker = () => {
    inquirer.prompt({
        message: 'From Here You Can View, Add, or Update Employee Data.  Select Exit If You Need to Quit The Application.',
        name: 'startData',
        type: 'list',
        choices: [ 
          'View All Departments',
          'View All Jobs',
          'View All Employees',
          'Add New Department',
          'Add New Job',
          'Add New Employee',
          'Update Employee Data',
          'Exit',
        ],
      })
// Runs departmentList function if user selects View All Departments
        .then(response => {
          if (response.startData === 'View All Departments') {
             departmentList();
// Runs jobList function if user selects View All Jobs
          } else if (response.startData === 'View All Jobs') {
             jobList();
// Runs employeeList function if user selects View All Employees
          } else if (response.startData === 'View All Employees') {
             employeeList();
// Runs addNewDepartment function if user selects Add New Department
          } else if (response.startData === 'Add New Department') {
             addNewDepartment();
// Runs addNewJob function if user selects Add New Job
          } else if (response.startData === 'Add New Job') {
             addNewJob();
// Runs addNewEmployee function if user selects Add New Employee
          } else if (response.startData === 'Add New Employee') {
             addNewEmployee();
// Runs updateEmployeeData function if user selects Update Employee Data
          } else if (response.startData === 'Update Employee Data') {
              updateEmployeeData();
// Ends conncection to database if user selects Exit
          } else if (response.startData === 'Exit') {
              db.end();
          } else {
              return ""
          }
        })
    };


// Object function displays department table
    const departmentList = () => {
        db.query(`SELECT * FROM department`, function (err, res) {
          if (err) throw err;
          console.table(res);
          accessEmployeeTracker();
        });
      };

// Object function displays job table
    const jobList = () => {
        db.query(`SELECT * FROM job`, function (err, res) {
          if (err) throw err;
          console.table(res);
          accessEmployeeTracker();
        });
      };

// Object function displays employee table
    const employeeList = () => {
        db.query(
            `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    job.title, 
                    department.department_name AS department,
                    job.salary, 
                    CONCAT (manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN job ON employee.job_id = job.id
                    LEFT JOIN department ON job.department_id = department.id
                    LEFT JOIN employee manager ON employee.manager_id = manager.id`,
          function (err, res) {
            if (err) throw err;
            console.table(res);
            accessEmployeeTracker();
          }
        );
      };

// Object function creates new department and adds to department table
    const addNewDepartment = () => {
        inquirer.prompt([
            {
              name: 'department',
              type: 'input',
              message: 'What is the name of the new Department?',
            },
          ])
          .then(answer => {
            db.query(
              'INSERT INTO department (department_name) VALUES (?)',
              [answer.department],
              function (err, res) {
                if (err) throw err;
                console.log("***********************************")
                console.log("*                                 *")
                console.log("*      NEW DEPARTMENT ADDED       *")
                console.log("*                                 *")
                console.log("***********************************")
                accessEmployeeTracker();
              }
            );
          });
      }; 

// Object function creates new job and adds to job table
      const addNewJob = () => {
        inquirer.prompt([
            {
              name: 'newJob',
              type: 'input',
              message: 'What is the title for the new job?',
              validate: addJob => {
                if (addJob) {
                    return true;
                } else {
                    console.log('Please enter a title.');
                    return false;
                }
              }
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary for the new job?',
              validate: (salary) => {
                if (isNaN(salary)) {
                    console.log('Please enter a valid salary.');
                } else {
                    return true;
                }
              }
            },
            {
              name: 'departmentId',
              type: 'input',
              message: 'What is the department id?',
              validate: (departmentId) => {
                if (isNaN(departmentId)) {
                    console.log('Please enter a valid department id.');
                } else {
                    return true;
                }
              }
            },
          ])
          .then(answer => {
            db.query(
              'INSERT INTO job (title, salary, department_id) VALUES (?, ?, ?)',
              [answer.newJob, answer.salary, answer.departmentId],
              function (err, res) {
                if (err) throw err;
                console.log('New Job Added');
                console.log("***********************************")
                console.log("*                                 *")
                console.log("*          NEW JOB ADDED          *")
                console.log("*                                 *")
                console.log("***********************************")
                accessEmployeeTracker();
              }
            );
          });
      };

// Object function creates new employee and adds to employee table      
      const addNewEmployee = () => {
        inquirer.prompt([
            {
              name: 'firstName',
              type: 'input',
              message: "Provide the new employee's first name?",
              validate: firstName => {
                if (firstName) {
                    return true;
                } else {
                    console.log('Please enter a first name.');
                    return false;
                }
              }
            },
            {
              name: 'lastName',
              type: 'input',
              message: "Provide the new employee's last name?",
              validate: lastName => {
                if (lastName) {
                    return true;
                } else {
                    console.log('Please enter a last name.');
                    return false;
                }
              }
            },
            {
              name: 'jobId',
              type: 'input',
              message: "What is the new employee's job id?",
              validate: (jobId) => {
                if (isNaN(jobId)) {
                    console.log('Please enter a valid id number.');
                } else {
                    return true;
                }
              }
            },
            {
              name: 'managerId',
              type: 'input',
              message: 'What is the manager id of the new employee?',
              validate: (managerId) => {
                if (isNaN(managerId)) {
                    console.log('Please enter a valid manager id number.');
                } else {
                    return true;
                }
              }
            },
          ])
          .then(answer => {
            db.query(
              'INSERT INTO employee (first_name, last_name, job_id, manager_id) VALUES (?, ?, ?, ?)',
              [answer.firstName, answer.lastName, answer.jobId, answer.managerId],
              function (err, res) {
                if (err) throw err;
                console.log('New Employee added!');
                console.log("***********************************")
                console.log("*                                 *")
                console.log("*        NEW EMPLOYEE ADDED       *")
                console.log("*                                 *")
                console.log("***********************************")
                accessEmployeeTracker();
              }
            );
          });
      };

// Object function used to update employee data inside employe table
      const updateEmployeeData = () => {
        inquirer.prompt([
            {
              name: 'employeeId',
              type: 'input',
              message: 'Provide Employee Id Number',
              validate: (employeeId) => {
                if (isNaN(employeeId)) {
                    console.log('Please enter a valid employee id number.');
                } else {
                    return true;
                }
              }
            },
            {
              name: 'jobId',
              type: 'input',
              message: 'Provide a new job id',
              validate: (jobID) => {
                if (isNaN(jobID)) {
                    console.log('Please enter a valid job id number.');
                } else {
                    return true;
                }
              }
            },
          ])
          .then(answer => {
            db.query(
              'UPDATE employee SET job_id=? WHERE id=?',
              [answer.jobId, answer.employeeId],
              function (err, res) {
                if (err) throw err;
                console.log('Employee data has been updated!');
                console.log("***********************************")
                console.log("*                                 *")
                console.log("*      EMPLOYEE DATA UPDATED      *")
                console.log("*                                 *")
                console.log("***********************************")
                accessEmployeeTracker();
              }
            );
          });
      };
      