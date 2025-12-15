module.exports = (sequelize, DataTypes) => {
    const PushSubscription = sequelize.define("pushSubscription", {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      endpoint: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      p256dh: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      auth: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'PushSubscriptions',
    });
  
    PushSubscription.associate = (models) => {
      PushSubscription.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    };
  
    return PushSubscription;
  };
