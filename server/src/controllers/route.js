const { route, rbac, role } = require("../../models");

exports.addRoute = async (req, res) => {
  try {
    const dataRoute = req.body;

    console.log(dataRoute);

    const newRoute = await route.create({ ...dataRoute });

    console.log(newRoute);

    const dataRbac = await rbac.create({
      role_id: 1,
      route_id: `${newRoute.id}`,
    });

    console.log(dataRbac);

    let showroute = await rbac.findOne({
      where: {
        id: dataRbac.id,
      },
      include: {
        model: role,
        as: "role",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      include: {
        model: route,
        as: "route",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["route_id", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        rbac: showroute,
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

exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;

    await route.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Update route id: ${id} finished`,
      data: {
        route: req.body,
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

exports.getRoutes = async (req, res) => {
  try {
    const dataRoutes = await route.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        route: dataRoutes,
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

exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    await route.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete route id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
