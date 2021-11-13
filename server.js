const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


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
          } else if(response.startData === 'Add Department') {
              addDepartment()
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

      

