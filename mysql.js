const database = {
  host: 'weqshar.beget.tech',
  // host: 'localhost',
  user: 'weqshar_training',
  database: 'weqshar_training',
  // password: 'Ts%d3Awv',
  password: 'zWaF9*rC',
  multipleStatements: true,
};

const queries = {
  userAdd: (id, name, email, password) => {
    return (`
    INSERT INTO users VALUES('${id}','${name}','${email}','${password}');
    INSERT INTO profiles (user_id) VALUES('${id}');
    `);
  },
  // INSERT INTO exercises (user_id) VALUES('${id}');
  getProdileData: id => {
    return `SELECT * FROM profiles WHERE user_id='${id}';`;
  },
};

module.exports = {
  queries,
  database,
};
