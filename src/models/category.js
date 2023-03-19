
export default function category(sequelize, DataTypes) {
  const Category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    slug: {
      type: DataTypes.STRING,
    },
    priority: { //priority means: <=0: excluded from storefront; >0: exposed on storefront on the position!
      type: DataTypes.INTEGER,
    },
  }, { underscored: true });

  Category.associate = models => {
    Category.hasMany(models.Product);
  };

  return Category;
};
