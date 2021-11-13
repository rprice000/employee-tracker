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
    //   .then(response => {
    //     switch (response.menu) {
    //     case 'View all departments':
    //       departmentData();
    //       break;
    //   }
    // });
    
    

        .then(response => {
          if(response.startData === 'View All Departments') {
              departmentData()
          }
      })



    };

    const departmentData = () => {
        db.query('SELECT * FROM department', function (err, res) {
          if (err) throw err;
          console.table(res);
          accessEmployeeTracker();
        });
      };

