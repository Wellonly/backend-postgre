
export default function review(sequelize, DataTypes) {
  const Review = sequelize.define('review', {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.STRING,
    },
    command_id: {
      type: DataTypes.INTEGER,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
    customer_id: {
      type: DataTypes.INTEGER,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.TEXT,
    },
  }, { underscored: true });

  Review.associate = models => {
    Review.belongsTo(models.Command);
    Review.belongsTo(models.Product);
    Review.belongsTo(models.Customer);
  };

  return Review;
};
