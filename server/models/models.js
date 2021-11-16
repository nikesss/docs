const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true  },
    email:{type: DataTypes.STRING, unique: true, allowNull: false},
    password:{type: DataTypes.STRING, allowNull: false},
    isActivated:{type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink:{type: DataTypes.STRING}
})

const Token = sequelize.define('token',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken:{type: DataTypes.STRING, allowNull: false}
})


User.hasOne(Token)
Token.belongsTo(User)

module.exports = {User,Token};