module.exports = (sequelize, DataTypes) => {
  const BlogArticle = sequelize.define('BlogArticle', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
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
      allowNull: false,
    },
  }, {
    tableName: 'BlogArticles',
    timestamps: true,
  });

  return BlogArticle;
};
