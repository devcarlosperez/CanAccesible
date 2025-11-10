module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM('usuario', 'admin', 'municipio'),
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'Roles',
    timestamps: true,
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
  };

  return Role;
};
