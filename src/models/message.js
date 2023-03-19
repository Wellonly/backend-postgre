
export default function message(sequelize, DataTypes) {
  const Message = sequelize.define('message', {
    user_id: {
      type: DataTypes.INTEGER,
    },
    folder_id: {
      type: DataTypes.INTEGER,
    },
    to_id: {
      type: DataTypes.INTEGER,
    },
    inbox_id: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
    text: {
      type: DataTypes.TEXT,
    },
    sentAt: {
      type: DataTypes.DATE,
    },
    readAt: {
      type: DataTypes.DATE,
    },
  }, { underscored: true });

  Message.associate = models => {
    Message.belongsTo(models.User);
    Message.belongsTo(models.Folder/* , { foreignKey: 'folder_id' } */);
    // Message.belongsTo(models.Folder/* , { foreignKey: 'inbox_id' } */);
  };

  return Message;
};
