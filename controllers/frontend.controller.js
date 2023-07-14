const db = require("../models/bundle.model");
const Op = db.sequelize.Op;
const func = require("../libs/functions");
const { v4: uuidv4 } = require("uuid");

exports.getProdukHome = async (req, res) => {
  db.produk
    .findAll({
      attributes: ["id", "title", "image", "price", "url"],
      limit: 8,
    })
    .then((result) => {
      if (result.length > 0) {
        res.send({
          code: 200,
          message: "Ok",
          data: result,
        });
      } else {
        res.status(404).send({
          code: 404,
          message: "Data tidak tersedia",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "Error find data > " + err,
      });
    });
};

exports.getProdukPage = async (req, res) => {
  let keywoard = "";

  const condition = [];
  if (req.query.keywoard) {
    keywoard = req.query.keywoard;
    condition.push({
      title: { [Op]: "%" + keywoard + "%" },
    });
  }

  db.produk
    .findAll({
      where: condition,
      attributes: ["id", "title", "image", "price", "url"],
    })
    .then((result) => {
      if (result.length > 0) {
        res.send({
          code: 200,
          message: "Ok",
          data: result,
        });
      } else {
        res.status(404).send({
          code: 404,
          message: `Tidak ada data yang cocok pada keywoard '${keywoard} '`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "Error find data > " + err,
      });
    });
};

exports.getProdukDetail = async (req, res) => {
  const url = req.params.url;

  db.produk
    .findOne({
      where: { url: url },
      attributes: [
        "id",
        "title",
        "description",
        "full_description",
        "image",
        "price",
        "category_id",
      ],
      include: [
        {
          model: db.kategori,
          attributes: ["name"],
        },
      ],
    })
    .then((result) => {
      if (result) {
        res.send({
          code: 200,
          message: "Ok",
          data: result,
        });
      } else {
        res.status(404).send({
          code: 404,
          message: "Produk telah dihapus",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "Error find data",
      });
    });
};

exports.getDataKeranjang = async (req, res) => {
  const session_id = req.query.session_id;

  db.keranjang
    .findAll({
      where: { session_id: session_id },
      include: [
        {
          model: db.produk,
        },
      ],
    })
    .then((result) => {
      if (result.length > 0) {
        res.send({
          code: 200,
          message: "Ok",
          data: result,
        });
      } else {
        res.status(404).send({
          code: 404,
          message: "Belum ada data di keranjang",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "Error retrive data > " + err,
      });
    });
};

exports.tambahDataKeranjang = async (req, res) => {
  const data = {
    produk_id: req.body.id,
    qty: req.body.qty,
    session_id: req.body.session_id,
  };

  db.keranjang
    .create(data)
    .then((result) => {
      res.send({
        code: 200,
        message: "Ok",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "Error menambahkan data keranjang..",
      });
    });
};

exports.ubahDataKeranjang = async (req, res) => {};

exports.hapusDataKeranjang = async (req, res) => {};

exports.checkout = async (req, res) => {};
