
export default function product(sequelize, DataTypes) {
  const Product = sequelize.define('product', {
    category_id: {
      type: DataTypes.INTEGER,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
    },
    variant: {
      type: DataTypes.STRING,
    },
    priority: { //priority means: <=0: excluded from storefront; >0: exposed on storefront on the position!
      type: DataTypes.INTEGER,
    },
    highprice: {
      type: DataTypes.FLOAT,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    optprice: {
      type: DataTypes.FLOAT,
    },
    optfrom: {
      type: DataTypes.INTEGER,
    },
    video: {
      type: DataTypes.STRING,
    },
    images: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    stock: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    length: {
      type: DataTypes.FLOAT,
    },
    width: {
      type: DataTypes.FLOAT,
    },
    height: {
      type: DataTypes.FLOAT,
    },
    spec: {
      type: DataTypes.TEXT,
    },
    artimages: {
      type: DataTypes.STRING,
    },
    article: {
      type: DataTypes.TEXT,
    },
  }, { underscored: true });

  Product.associate = models => {
    Product.belongsTo(models.Category);
    Product.belongsToMany(models.Collection, {through: models.ProductCollection});
    Product.hasMany(models.Review);
  };

  return Product;
};
