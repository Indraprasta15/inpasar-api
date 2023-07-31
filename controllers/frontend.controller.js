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
      attributes: ["id", "qty", "session_id", "createdAt"],
      include: [
        {
          model: db.produk,
          attributes: ["id", "title", "image", "price", "url"],
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
  const cekKeranjang = db.keranjang.findOne({
    where: [
      {
        produk_id: req.body.produk_id,
      },
      {
        session_id: req.body.session_id,
      },
    ],
  });

  if (cekKeranjang !== null) {
    const data = {
      qty: cekKeranjang.qty + 1,
    };

    await db.keranjang
      .update(data, {
        where: { id: cekKeranjang.id },
      })
      .then((result) => {
        res.send({
          code: 200,
          message: "Berhasil menambah keranjang.",
        });
      })
      .catch((err) => {
        res.status(500).send({
          code: 500,
          message: "Error update keranjang > ",
          err,
        });
      });
  } else {
    const data = {
      produk_id: req.body.produk_id,
      qty: req.body.qty,
      session_id: req.body.session_id,
    };

    await db.keranjang
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
  }
};

exports.ubahDataKeranjang = async (req, res) => {
  const id = req.body.id;
  const qty = req.body.qty;

  await db.keranjang
    .update(
      { qty: qty },
      {
        where: { id: id },
      }
    )
    .then((result) => {
      if (result[0]) {
        res.send({
          code: 200,
          message: "Sukses ubah data",
        });
      } else {
        res.status(422).send({
          code: 422,
          message: "Ada yang salah dari input",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "Error ubah data > ",
        err,
      });
    });
};

exports.hapusDataKeranjang = async (req, res) => {
  const id = req.params.id;

  db.keranjang
    .destroy({ where: { id: id } })
    .then((result) => {
      res.send({
        code: 200,
        message: "Sukses menghapus data",
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "Error hapus data > ",
        err,
      });
    });
};

exports.checkout = async (req, res) => {
  const session_id = req.query.session_id;

  const data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    alamat: req.body.alamat,
    phone: req.body.phone,
  };

  const dataKeranjang = await db.keranjang.findAll({
    where: { session_id: session_id },
  });

  if (dataKeranjang.length > 0) {
    const trs_number = "TRS" + Date.now();
    const trs_id = uuidv4();

    const dataTransaksi = {
      id: trs_id,
      trs_number: trs_number,
    };

    await db.transaksi.create(dataTransaksi);

    dataKeranjang.map((item, index) => {
      const dataTrsDetil = {
        qty: item.qty,
        produk_id: item.produk_id,
        trs_id: trs_id,
      };

      db.transaksi_detail.create(dataTrsDetil);
      db.keranjang.destroy({ where: { id: item.id } });
    });

    await db.customer.create(data);

    await res.status(200).send({
      code: 200,
      message: "Sukses melakukan transaksi",
    });
  }
};
