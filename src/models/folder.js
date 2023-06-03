
export default function folder(sequelize, DataTypes) {
  const Folder = sequelize.define('folder', {
    // id: {
    //   primaryKey: true,
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    user_id: {
      type: DataTypes.INTEGER,
    },
    priority: { //priority means: <=0: excluded ; >0: exposed to menu!
      type: DataTypes.INTEGER, /**NOTE: DataTypes.INTEGER(8) size applicable for MySQL/MariaDB only  */
    },
    place: {
      type: DataTypes.INTEGER, /** type PLACE */
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    icon: {
      type: DataTypes.STRING(15),
    },
    color: {
      type: DataTypes.STRING(15),
    },
    slug: {
      type: DataTypes.STRING(15),
    },
    filter: {
      type: DataTypes.STRING,
    },
  }, { underscored: true });

  Folder.associate = models => {
    Folder.belongsTo(models.User);
    Folder.hasMany(models.Message /* , { onDelete: 'CASCADE' } */);
  };

  return Folder;
};
