const { profile, user } = require("../../models");

exports.updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);

    let updateData = Object.assign({}, req.body); // Copy req.body in order not to change it
    updateData.image = req.file.filename;
    console.log(updateData);
    await profile.update(updateData, {
      where: {
        user_id: id,
      },
    });

    const dataUser = await user.findOne({
      where: {
        id,
      },
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["user_id", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["password", "role_id", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(dataUser));

    newDataUser = {
      ...data,
      image: process.env.PATH_FILE + data.profile.image,
    };

    res.send({
      status: "success",
      message: `Update user id: ${id} finished`,
      data: {
        user: {
          fullName: dataUser.fullName,
          email: dataUser.email,
          gender: dataUser.profile.gender,
          phone: dataUser.profile.phone,
          address: dataUser.profile.address,
          image: newDataUser.image,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["user_id", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["password", "role_id", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(dataUser));

    newDataUser = {
      ...data,
      image: process.env.PATH_FILE + data.profile.image,
    };

    res.send({
      status: "success",
      data: {
        user: {
          fullName: dataUser.fullName,
          email: dataUser.email,
          gender: dataUser.profile.gender,
          phone: dataUser.profile.phone,
          address: dataUser.profile.address,
          image: newDataUser.image,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
