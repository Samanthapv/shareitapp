"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      picture: DataTypes.STRING,
      points: DataTypes.INTEGER,
    },
    {}
  );
  User.associate = function (models) {
    User.hasMany(models.Product, { onDelete: "cascade" });
    User.hasMany(models.Request, { onDelete: "cascade" });
  };

  return User;
};
