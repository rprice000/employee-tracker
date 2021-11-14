const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { type } = require('os');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db',
  });

  db.connect(err => {
    if (err) throw err;
    console.log("Please follow the prompts to access Employee Tracker Data");
    accessEmployeeTracker();
  });

  const accessEmployeeTracker = () => {
    inquirer.prompt({
        message: 'From Here You Can View, Add, or Update Employee Data.  Select Exit If You Need to Quit The Application.',
        name: 'startData',
        type: 'list',
        choices: [ 
          'View All Departments',
          'View All Jobs',
          'View All Employees',
          'Add Department',
          'Add Job',
          'Add Employee',
          'Update Employee Data',
          'Exit',
        ],
      })
        .then(response => {
          if (response.startData === 'View All Departments') {
             departmentList()
          } else if (response.startData === 'View All Jobs') {
             jobList()
          } else if (response.startData === 'View All Employees') {
             employeeList()
          } else if (response.startData === 'Add Department') {
             addDepartment()
          } else if (response.startData === 'Add Job') {
             addJob();
          }
        })




    };








    const departmentList = () => {
        db.query(`SELECT * FROM department`, function (err, res) {
          if (err) throw err;
          console.table(res);
          accessEmployeeTracker();
        });
      };

    const jobList = () => {
        db.query(`SELECT * FROM job`, function (err, res) {
          if (err) throw err;
          console.table(res);
          accessEmployeeTracker();
        });
      };

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

    const addDepartment = () => {
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
                console.log('New Department added!');
                accessEmployeeTracker();
              }
            );
          });
      }; 

      const addJob = () => {
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
              message: 'What is the department ID?',
              validate: (addDepartmentID) => {
                if (isNAN(addDepartmentID)) {
                    console.log('Please enter a department id.');
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
                accessEmployeeTracker();
              }
            );
          });
      };
