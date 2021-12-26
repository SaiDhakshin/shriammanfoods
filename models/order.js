const Sequelize = require('sequelize');

const sequelize = require('../util/sequelize');

const Order = sequelize.define('order',{
    id: {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    mobile_number : {
        type : Sequelize.STRING,
        allowNull : false
    },
    address : {
        type : Sequelize.STRING,
        allowNull : false
    },
    product : {
        type : Sequelize.STRING,
        allowNull : false
    },
    quantity : {
        type : Sequelize.INTEGER,
        allowNull : false
    }
})




module.exports = Order;