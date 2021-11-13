INSERT INTO department (department_name)
VALUES 
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO job (title, salary, department_id)
VALUES
('Engineer Team Lead', 95000, 1),
('Software Engineer', 80000, 1),
('Accountant Team Lead', 95000, 2),
('Accountant', 80000, 2),
('Legal Team Lead', 95000, 3),
('Lawyer', 80000, 3),
('Sales Team Lead', 95000, 4),
('Sales Member', 80000, 4);


INSERT INTO employee (last_name, first_name, job_id, manager_id)
VALUES 
('Smith', 'John', 1, NULL),
('Jordan', 'Jane', 2, 1),
('Rogers', 'Judy', 2, 1),
('Allen', 'Joe', 3, NULL),
('Wanye', 'Jack', 4, 3),
('Parker', 'Jill', 4, 3),
('Jones', 'Mark', 5, NULL),
('West', 'Matt', 6, 5),
('Wislon', 'Bob', 6, 5),
('Barnes', 'Bill', 7, NULL),
('Banner', 'Susan', 8, 7),
('Junior', 'Carl', 8, 7);