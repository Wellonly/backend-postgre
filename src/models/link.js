
export default function link(sequelize, DataTypes) {
  const Link = sequelize.define('link', {
    menu: { //menu types: top; left; bottom; right;
      type: DataTypes.STRING(10),
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

  Link.associate = models => {
    Link.hasMany(models.Sublink);
  };

  return Link;
};
