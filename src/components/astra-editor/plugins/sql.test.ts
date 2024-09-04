import { MySQL, SQLite } from '@codemirror/lang-sql'
import { EditorState } from '@codemirror/state'
import { deepEqual } from 'node:assert'
import { test } from 'node:test'
import { splitSqlQuery } from './sql-statement-highlight'

function sqlite(code: string) {
  const state = EditorState.create({ doc: code, extensions: [SQLite] })
  return splitSqlQuery(state).map((p) => p.text)
}

function mysql(code: string) {
  const state = EditorState.create({ doc: code, extensions: [MySQL] })
  return splitSqlQuery(state).map((p) => p.text)
}

test('should parse a query with different statements in a single line', () => {
  deepEqual(sqlite(`INSERT INTO Persons (PersonID, Name) VALUES (1, 'Jack');SELECT * FROM Persons`), [
    `INSERT INTO Persons (PersonID, Name) VALUES (1, 'Jack');`,
    `SELECT * FROM Persons`,
  ])
})

test('should identify a query with different statements in multiple lines', () => {
  deepEqual(
    sqlite(`
        INSERT INTO Persons (PersonID, Name) VALUES (1, 'Jack');
        SELECT * FROM Persons';
      `),
    [`INSERT INTO Persons (PersonID, Name) VALUES (1, 'Jack');`, `SELECT * FROM Persons';\n      `]
  )
})

test('sholud be able to split statement with BEGIN and END', () => {
  deepEqual(
    sqlite(`CREATE TABLE customer(
  cust_id INTEGER PRIMARY KEY,
  cust_name TEXT,
  cust_addr TEXT
);

-- some comment here that should be ignore


CREATE VIEW customer_address AS
   SELECT cust_id, cust_addr FROM customer;
CREATE TRIGGER cust_addr_chng
INSTEAD OF UPDATE OF cust_addr ON customer_address
BEGIN
  UPDATE customer SET cust_addr=NEW.cust_addr
   WHERE cust_id=NEW.cust_id;
END ;`),
    [
      `CREATE TABLE customer(\n  cust_id INTEGER PRIMARY KEY,\n  cust_name TEXT,\n  cust_addr TEXT\n);`,
      `CREATE VIEW customer_address AS\n   SELECT cust_id, cust_addr FROM customer;`,
      `CREATE TRIGGER cust_addr_chng\nINSTEAD OF UPDATE OF cust_addr ON customer_address\nBEGIN\n  UPDATE customer SET cust_addr=NEW.cust_addr\n   WHERE cust_id=NEW.cust_id;\nEND ;`,
    ]
  )
})

test('should be able to split statement with BEGIN and END and CONDITION inside', () => {
  deepEqual(
    mysql(`CREATE TRIGGER upd_check BEFORE UPDATE ON account
FOR EACH ROW
BEGIN
    IF NEW.amount < 0 THEN
        SET NEW.amount = 0;
    ELSEIF NEW.amount > 100 THEN
        SET NEW.amount = 100;
    END IF;
END; SELECT * FROM hello`),
    [
      `CREATE TRIGGER upd_check BEFORE UPDATE ON account\nFOR EACH ROW\nBEGIN\n    IF NEW.amount < 0 THEN\n        SET NEW.amount = 0;\n    ELSEIF NEW.amount > 100 THEN\n        SET NEW.amount = 100;\n    END IF;\nEND;`,
      'SELECT * FROM hello',
    ]
  )
})

test('should be able to split statement with BEGIN with no end', () => {
  deepEqual(
    mysql(`SELECT * FROM outerbase; CREATE TRIGGER upd_check BEFORE UPDATE ON account
FOR EACH ROW
BEGIN
    IF NEW.amount < 0 THEN
        SET NEW.amount = 0;
    ELSEIF NEW.amount > 100 THEN
        SET NEW.amount = 100;`),
    [
      'SELECT * FROM outerbase;',
      `CREATE TRIGGER upd_check BEFORE UPDATE ON account
FOR EACH ROW
BEGIN
    IF NEW.amount < 0 THEN
        SET NEW.amount = 0;
    ELSEIF NEW.amount > 100 THEN
        SET NEW.amount = 100;`,
    ]
  )
})

test('should be able to split TRIGGER without begin', () => {
  deepEqual(
    mysql(`create trigger hire_log after insert on employees 
for each row insert into hiring values (new.id, current_time());
    
insert into employees (first_name, last_name) values ("Tim", "Sehn");`),
    [
      `create trigger hire_log after insert on employees \nfor each row insert into hiring values (new.id, current_time());`,
      `insert into employees (first_name, last_name) values ("Tim", "Sehn");`,
    ]
  )
})

test('should be able to split nested BEGIN', () => {
  deepEqual(
    mysql(
      `CREATE PROCEDURE procCreateCarTable
IS
BEGIN
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE CARS';
    EXCEPTION WHEN OTHERS THEN NULL;
    EXECUTE IMMEDIATE 'CREATE TABLE CARS (ID VARCHAR2(1), NAME VARCHAR2(10), TITLE    
    VARCHAR2(10))';
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TRUCKS';
    EXCEPTION WHEN OTHERS THEN NULL;
    EXECUTE IMMEDIATE 'CREATE TABLE TRUCKS (ID VARCHAR2(1), NAME VARCHAR2(10), TITLE 
    VARCHAR2(10))';
  END;
END; SELECT * FROM outeerbase;`
    ),
    [
      `CREATE PROCEDURE procCreateCarTable
IS
BEGIN
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE CARS';
    EXCEPTION WHEN OTHERS THEN NULL;
    EXECUTE IMMEDIATE 'CREATE TABLE CARS (ID VARCHAR2(1), NAME VARCHAR2(10), TITLE    
    VARCHAR2(10))';
  END;
  BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TRUCKS';
    EXCEPTION WHEN OTHERS THEN NULL;
    EXECUTE IMMEDIATE 'CREATE TABLE TRUCKS (ID VARCHAR2(1), NAME VARCHAR2(10), TITLE 
    VARCHAR2(10))';
  END;
END;`,
      'SELECT * FROM outeerbase;',
    ]
  )
})
