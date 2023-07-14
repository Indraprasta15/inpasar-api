module.exports = (sequelize, Sequelize) => {
  const Transaksi = sequelize.define("transaksi", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    full_description: {
      type: Sequelize.TEXT,
    },
    image: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    url: {
      type: Sequelize.STRING,
    },
  });

  return Transaksi;
};
