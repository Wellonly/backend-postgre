
export default function sublink(sequelize, DataTypes) {
  const Sublink = sequelize.define('sublink', {
    link_id: {
      type: DataTypes.INTEGER,
    },
    priority: { //priority means: <=0: excluded ; >0: exposed to menu!
      type: DataTypes.INTEGER,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    icon: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
    },
    component: {
      type: DataTypes.STRING,
    },
    images: {
      type: DataTypes.STRING,
    },
    template: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
    },
  }, { underscored: true });

  Sublink.associate = models => {
    Sublink.belongsTo(models.Link);
  };

  return Sublink;
};
