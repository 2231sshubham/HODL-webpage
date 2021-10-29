'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Coin.init({
    name: DataTypes.STRING,
    last: DataTypes.REAL,
    buy: DataTypes.REAL,
    sell: DataTypes.REAL
  }, {
    sequelize,
    tableName: 'coins',
    modelName: 'Coin',
  });
  return Coin;
};
