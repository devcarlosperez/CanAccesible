module.exports = (app) => {
  const user = require("../controllers/user.controller");
  const router = require("express").Router();

  // Crear un nuevo usuario
  router.post("/", user.create);

  // Obtener todos los usuarios
  router.get("/", user.findAll);

  // Obtener un usuario por ID
  router.get("/:id", user.findOne);

  // Actualizar un usuario por ID
  router.put("/:id", user.update);

  // Eliminar un usuario por ID
  router.delete("/:id", user.delete);

  // Conectar las rutas con el prefijo /api/users
  app.use("/api/users", router);
};
