module.exports = (sequelize, Sequelize) => {
  const Transaksi_detil = sequelize.define("transaksi_detil", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    qty: {
      type: Sequelize.INTEGER,
    },
  });

  return Transaksi_detil;
};
