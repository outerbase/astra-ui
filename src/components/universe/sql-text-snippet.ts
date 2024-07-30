const text = `-- Creating a table with various data types and constraints
CREATE TABLE employees (
    employee_id INT PRIMARY KEY, -- Primary key constraint
    first_name VARCHAR(50) NOT NULL, -- Not null constraint
    last_name VARCHAR(50) NOT NULL, -- Not null constraint
    email VARCHAR(100) NOT NULL UNIQUE, -- Unique constraint
    hire_date DATE NOT NULL, -- Not null constraint
    job_id INT NOT NULL, -- Not null constraint
    salary DECIMAL(10, 2) DEFAULT 0.00, -- Default value
    department_id INT, -- Column without constraint
    FOREIGN KEY (department_id) REFERENCES departments(department_id), -- Foreign key constraint
    CHECK (salary >= 0) -- Check constraint
);

-- Inserting values into the table with various operators blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah  
INSERT INTO employees (employee_id, first_name, last_name, email, hire_date, job_id, salary, department_id) VALUES 
(1, 'John', 'Doe', 'john.doe@example.com', '2023-01-15', 101, 60000.00, 1), -- Insert with direct values
(2, 'Jane', 'Smith', 'jane.smith@example.com', '2023-02-20', 102, 55000.00, 2), -- Insert with direct values
(3, 'Jim', 'Brown', 'jim.brown@example.com', '2023-03-30', 103, 52000.00, 3), -- Insert with direct values
(4, 'Emily', 'Davis', 'emily.davis@example.com', '2023-04-25', 104, 58000.00, 4), -- Insert with direct values
(5, 'Michael', 'Wilson', 'michael.wilson@example.com', '2023-05-10', 105, 63000.00, 1); -- Insert with direct values

-- Updating data with various operators
UPDATE employees 
SET salary = salary * 1.10 -- Multiplication operator to increase salary
WHERE hire_date < '2024-01-01' -- Comparison operator to filter records

-- Deleting records with a condition
DELETE FROM employees 
WHERE employee_id = 3; -- Equality operator to specify the record to delete

-- Selecting data with operators
SELECT e.employee_id, e.first_name, e.last_name, e.email, e.salary, d.department_name 
FROM employees e
JOIN departments d ON e.department_id = d.department_id -- Join operator
WHERE e.salary > 50000.00 -- Greater than operator to filter results
AND d.department_name = 'Sales' -- Equality operator to filter results
ORDER BY e.salary DESC; -- Order by operator to sort results

-- Creating an index for performance optimization
CREATE INDEX idx_employees_last_name 
ON employees(last_name); -- Index creation operator

-- Altering the table structure to add a new column
ALTER TABLE employees 
ADD COLUMN phone_number VARCHAR(20) AFTER email; -- Add column operator

-- Dropping a table if it exists
DROP TABLE IF EXISTS temporary_table; -- Drop table operator with existence check

-- Inserting data into a temporary table
INSERT INTO temporary_table (temp_id, temp_data, temp_date) 
VALUES (1, 'Sample data with a very long string that spans multiple words and is quite lengthy, intended to demonstrate extremely long line lengths in SQL code', '2024-07-24'), -- Insert with long text
       (2, 'Another sample with even more data included here to make the line extremely long and unwieldy, showcasing how lengthy SQL lines can become for demonstration purposes', '2024-07-25'); -- Insert with long text

-- Updating data in the temporary table
UPDATE temporary_table 
SET temp_data = CONCAT(temp_data, ' - Updated with a long concatenation string that extends beyond usual length, demonstrating the capability to handle very long text updates effectively in SQL'); -- Concatenation operator to update text
`

export default text
