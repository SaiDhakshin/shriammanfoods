const Sequelize = require('sequelize');


// const sequelize = new Sequelize('authuser','saidhakshin','qmpzfgh4563',{
//     dialect: 'postgres',
//     host : 'localhost',
//     storage : './session.postgres',
//     dialectOptions: {
//       supportBigNumbers: true
//     }
// })

//PRODUCTION

// const sequelize = new Sequelize(process.env.DATABASE_URL,{
//   dialect: 'postgres',
//   storage : './session.postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//   },
//     supportBigNumbers: true
//   }
// })

const sequelize = new Sequelize(process.env.PG_DATABASE , process.env.USER , process.env.PASSWORD,{
  dialect: 'postgres',
  host : process.env.PG_HOST,
  storage : './session.postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
  },
    supportBigNumbers: true
  }
})

try {
     sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

module.exports = sequelize;