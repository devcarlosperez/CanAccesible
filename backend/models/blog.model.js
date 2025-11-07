module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateCreation: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    nameFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Blogs',
    timestamps: true,
  });

  Blog.associate = (models) => {
    Blog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Blog;
};
