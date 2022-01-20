// import model
const { user, role, profile } = require("../../models");

// import joi
const joi = require("joi");

// import bcrypt
const bcrypt = require("bcrypt");

// import jsonwebtoken
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
    fullName: joi.string().min(3).required().messages({
      "string.base": `Nama harus berupa teks`,
      "string.empty": `Nama tidak boleh kosong`,
      "string.min": `Minimal karakter untuk nama harus 3 digit`,
      "any.required": `Nama tidak boleh kosong`,
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.send({
      message: error.details[0].message,
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      email: req.body.email,
      password: hashedPassword,
      fullName: req.body.fullName,
      role_id: 2,
    });

    await profile.create({
      user_id: newUser.id,
    });

    const data = {
      id: newUser.id,
    };

    const SECRET_KEY = "IzinMasukMeteorId";

    const token = jwt.sign(data, SECRET_KEY);

    res.send({
      status: "success",
      message: "Register finished",
      data: {
        user: {
          fullName: newUser.fullName,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  // our validation schema here
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // if error exist send validation error message
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    if (!isValid) {
      return res.send({
        status: "failed",
        message: "Password not match",
      });
    }

    const data = {
      id: userExist.id,
      email: userExist.email,
    };

    const token = jwt.sign(data, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "success",
      data: {
        fullName: userExist.fullName,
        email: userExist.email,
        role_id: userExist.role_id,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const id = req.user.id;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await user.update(
      {
        email: req.body.email,
        password: hashedPassword,
        fullName: req.body.fullName,
        role_id: 2,
      },
      {
        where: {
          id: id,
        },
      }
    );

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password", "role_id", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: `Update password id: ${id} finished`,
      data: dataUser,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await profile.findOne({
      where: {
        user_id: id,
      },
    });

    var fs = require("fs");
    var filePath = `./uploads/${dataUser.image}`;
    fs.unlinkSync(filePath);

    await user.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete user id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success...",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          role_id: dataUser.role_id,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
