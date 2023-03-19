
export default function collection(sequelize, DataTypes) {
  const Collection = sequelize.define('collection', {
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
      unique: true,
    },
    priority: { //priority means: <=0: excluded from storefront; >0: exposed on storefront on the position!
      type: DataTypes.INTEGER,
    },
  }, { underscored: true });

  Collection.associate = models => {
    Collection.belongsToMany(models.Product, {through: models.ProductCollection});
    // Collection.belongsToMany(models.Product, { as: 'ProductCollection', through: 'product_collections', foreignKey: 'product_id', otherKey: 'collection_id'});
  };

  return Collection;
};
