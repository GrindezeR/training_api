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
    return `
    INSERT INTO users VALUES('${id}','${name}','${email}','${password}');
    INSERT INTO profiles (user_id) VALUES('${id}');
    `;
  },
  addExercises: (user_id, name, id) => {
    return `
    INSERT INTO exercises VALUES('${user_id}','${name}',0,'${id}');
    `;
  },
  getProfileData: id => {
    return `
    SELECT * FROM profiles WHERE user_id='${id}';
    SELECT * FROM exercises WHERE user_id='${id}';
    `;
  },
  getExercisesData: id => {
    return `
    SELECT * FROM exercises WHERE user_id='${id}';
    `;
  },
  updateExercisesCount: (id, count) => {
    return `
    UPDATE exercises SET count=${count} WHERE id='${id}';
    `;
  },
};

module.exports = {
  queries,
  database,
};
