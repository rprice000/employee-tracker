const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3301,
    user: 'root',
    password: 'password',
    database: 'employee_tracker',
  });
