const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
require('dotenv').config()

const app = express()

const SELECT_ALL_UNIS = "SELECT * FROM universities;"
const SELECT_ALL_COURSES = "SELECT * FROM courses;"
const SELECT_ALL_GRADES = `SELECT u.uni_name,
                                  c.course_name,
                                  grade,
                                  (SELECT AVG(g2.grade) media FROM grade as g2 JOIN universities u2 ON g2.uni_id = u2.uni_id WHERE u2.uni_id = u.uni_id) average
                            FROM grade as g
                              JOIN universities as u
                                ON u.uni_id = g.uni_id
                              JOIN courses as c
                                ON c.course_id = g.course_id
                                ORDER BY average DESC;`


const connection = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

connection.connect(err => {
  if(err){
    return err
  }
})

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get('/unis', (req, res) => {
  connection.query(SELECT_ALL_UNIS, (err, results) => {
    if(err)
      res.send(err)
    else
      return res.json({data: results})
  })
})

app.get('/courses', (req, res) => {
  connection.query(SELECT_ALL_COURSES, (err, results) => {
    if(err)
      res.send(err)
    else
      return res.json({data: results})
  })
})

app.get('/grades', (req, res) => {
  connection.query(SELECT_ALL_GRADES, (err, results) => {
    if(err)
      res.send(err)
    else
      return res.json({data: results})
  })
})

app.get('/unis/add', (req, res) => {

  const { name } = req.query
  const INSERT_UNI = `INSERT INTO universities (uni_name) VALUES ("${name}");`

  connection.query(INSERT_UNI, (err, results) => {
    if(err)
      res.send(err)
    else{
      return res.send("Universidade adicionada com sucesso!")
    }
  })
})

app.get('/courses/add', (req, res) => {
  const { name } = req.query
  const INSERT_COURSE = `INSERT INTO courses (course_name) VALUES ("${name}");`

  connection.query(INSERT_COURSE, (err, results) => {
    if(err)
      res.send(err)
    else{
      return res.send("Curso adicionado com sucesso!")
    }
  })
})

app.get('/grade/add', (req, res) => {
  const { uni_id, course_id, grade } = req.query
  const INSERT_GRADE = `INSERT INTO grade (uni_id, course_id, grade ) VALUES (${uni_id}, ${course_id}, ${grade});`
  console.log(INSERT_GRADE)

  connection.query(INSERT_GRADE, (err, results) => {
    if(err)
      res.send(err)
    else{
      return res.send("Nota adicionada com sucesso!")
    }
  })
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`sample listening on port 4000`)
})