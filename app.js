const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { database, queries } = require('./mysql.js');

const app = express();
app.use(express.json());
app.use(cors());
app.listen(3000, '192.168.0.104', error => {
  error ? console.log(error) : console.log(`listening port ${3000}`);
});
// app.listen(3000);

app.post('/api/register', async (request, response) => {
  const name = request.body.name;
  const email = request.body.email;
  const password = request.body.password;
  const db = mysql.createConnection(database);

  if (email && name && password) {
    const salt = await bcrypt.genSaltSync(10);
    const user_id = crypto.randomUUID();
    const user = `SELECT * FROM users WHERE name='${name}';`;

    db.connect(connectionError => {
      if (connectionError) {
        console.log('CONNECT MYSQL ERROR');
        response.status(500).send(`CONNECT MYSQL ERROR`);
      }
      db.query(user, (_, result) => {
        console.log(result);
        if (result && result[0]?.name === name) {
          console.log('SAME USER');
          response.status(400).send('Username already exist');
          db.end();
        } else {
          bcrypt.hash(password, salt, (_, hash) => {
            db.query(
              queries.userAdd(user_id, name, email, hash),
              (error, result) => {
                if (result) {
                  response.status(200).send('SUCCESS');
                } else {
                  console.log(`PROFILE ERROR -`, error);
                  response.status(500).send(`PROFILE ERROR`, error);
                }
                db.end();
              }
            );
          });
        }
      });
    });
  } else {
    console.log('USER DATA ERROR');
    response.status(400).send('USER DATA ERROR');
  }
});

app.post('/api/auth', async (request, response) => {
  const name = request.body.name;
  const password = request.body.password;
  const db = mysql.createConnection(database);
  const getPasswordFromBase = `SELECT * FROM users WHERE name='${name}';`;

  db.connect(connectionError => {
    if (connectionError) {
      console.log('CONNECT MYSQL ERROR');
      response.status(500).send(`CONNECT MYSQL ERROR`);
    }

    db.query(getPasswordFromBase, async (error, result) => {
      if (result[0]) {
        const samePass = await bcrypt.compareSync(password, result[0].password);
        if (samePass) {
          response
            .status(200)
            .send({ status: 200, user_id: result[0].id, message: 'SUCCESS' });
        } else {
          console.log('QUERY ERROR, PASSWORDS DONT MATCH');
          response
            .status(403)
            .send({ error, message: 'Check login or password' });
        }
      } else {
        response
          .status(403)
          .send({ error, message: 'Check login or password' });
      }
      db.end();
    });
  });
});

app.get('/api/profile', async (request, response) => {
  const user_id = request.query.id;
  if (!user_id) return;
  const db = mysql.createConnection(database);

  db.connect(() => {
    db.query(queries.getProfileData(user_id), (_, result) => {
      console.log(result);
      if (result[0]) {
        response.status(200).send(result);
      } else {
        response.status(404).send({
          status: 404,
          message: 'USER NOT FOUND',
        });
      }
      db.end();
    });
  });
});

app.get('/api/exercises', async (request, response) => {
  const user_id = request.query.id;
  if (!user_id) return;
  const db = mysql.createConnection(database);

  db.connect(() => {
    db.query(queries.getExercisesData(user_id), (_, result) => {
      console.log(result);
      if (result[0]) {
        response.status(200).send({ status: 200, result });
      } else {
        response.status(404).send({
          status: 404,
          message: 'EXERCISES NOT FOUND',
        });
      }
      db.end();
    });
  });
});

app.post('/api/exercises', async (request, response) => {
  const user_id = request.body.user_id;
  const name = request.body.name;

  if (!user_id && !name) return;
  const db = mysql.createConnection(database);
  const exercise = `SELECT * FROM exercises WHERE name='${name}';`;
  db.connect(() => {
    db.query(exercise, (_, result) => {
      if (result[0]?.name) {
        console.log('EXERCISES ALREADY EXIST');
        response.status(400).send('You already have this exercises');
        db.end();
      } else {
        db.query(
          queries.addExercises(user_id, name, crypto.randomUUID()),
          (_, result) => {
            console.log(result);
            if (result) {
              response.status(200).send('SUCSESS');
            } else {
              response.status(500).send('ADD ERROR');
            }
            db.end();
          }
        );
      }
    });
  });
});

app.put('/api/exercises', async (request, response) => {
  const count = request.body.count;
  const id = request.body.id;
console.log('start:', {count,id})
  const db = mysql.createConnection(database);
  if (!count && !id) return;
  db.connect(() => {
    db.query(queries.updateExercisesCount(id, count), (_, result) => {
      console.log(result);
      if (result) {
        response.status(200).send('SUCSESS');
      } else {
        response.status(500).send('UPDATE ERROR');
      }
      db.end();
    });
  });
});
