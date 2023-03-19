
//this auto created by Collection.belongsToMany(models.Product) & Product.belongsToMany(models.Collection)
export default function product_collection(sequelize, DataTypes) {
  const ProductCollection = sequelize.define('product_collection', {
  }, { underscored: true });

  ProductCollection.associate = models => {
  };

  return ProductCollection;
};
