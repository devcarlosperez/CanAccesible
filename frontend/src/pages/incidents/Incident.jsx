import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import {
  getAllIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
} from "../../services/incidentService";

import { getAllUsers } from "../../services/userService";
import useAuthStore from "../../services/authService.js";

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Pagination,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Incident = () => {
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingIncident, setEditingIncident] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const initialFormData = {
    name: "",
    description: "",
    incidentStatusId: 1,
    incidentTypeId: 1,
    incidentSeverityId: 1,
    userId: 1,
    island: "",
    area: "",
    latitude: "",
    longitude: "",
    dateIncident: new Date().toISOString().split("T")[0],
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchIncidents();
    fetchUsers();
  }, []);

  const getUserName = (id) => {
    const user = users.find(u => Number(u.id) === Number(id));
    if (!user) return "Desconocido";
    return `${user.firstName} ${user.lastName || ""}`.trim();
  };

  const fetchIncidents = async () => {
    try {
      const data = await getAllIncidents();
      setIncidents(data);
    } catch (err) {
      console.error("Error cargando incidencias:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  const { isAuthenticated, user } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const preparedData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      const data = new FormData();

      Object.keys(preparedData).forEach((key) => {
        if (key !== "imageFile") {
          data.append(key, preparedData[key]);
        }
      });

      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      }

      if (editingIncident) {
        await updateIncident(editingIncident.id, data);
      } else {
        await createIncident(data);
      }

      setFormData(initialFormData);
      setEditingIncident(null);
      setShowForm(false);
      fetchIncidents();
    } catch (err) {
      console.error("Error guardando incidencia:", err);
    }
  };



  const handleEdit = (incident) => {
    setEditingIncident(incident);
    setFormData({ ...incident });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteIncident(id);
      fetchIncidents();
    } catch (err) {
      console.error("Error eliminando incidencia:", err);
    }
  };

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIncidents = incidents.slice(startIndex, endIndex);
  const pageCount = Math.ceil(incidents.length / itemsPerPage);

  return (
    <section>
      <Header transparent={false} />
      <div className="pt-40 p-8">
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
          Gestión de Incidencias
        </Typography>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              color={showForm ? "error" : "primary"}
              startIcon={showForm ? <CancelIcon /> : <AddIcon />}
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  setFormData(initialFormData);
                  setEditingIncident(null);
                }
              }}
            >
              {showForm ? "Cancelar" : "Nueva Incidencia"}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/login")}
            >
              Inicia sesión para poder crear incidencias
            </Button>
          )}
        </div>

        {/* FORMULARIO */}
        {showForm && (
          <Paper
            elevation={3}
            sx={{
              maxWidth: 800,
              margin: "0 auto",
              p: 4,
              mb: 4,
              borderRadius: 2,
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="h6" align="center" sx={{ mb: 3 }}>
              {editingIncident ? "Editar Incidencia" : "Nueva Incidencia"}
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} direction="column">
                {/* Nombre */}
                <Grid item>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                {/* Descripción */}
                <Grid item>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Descripción"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                {/* Isla */}
                <Grid item>
                  <TextField
                    select
                    fullWidth
                    label="Isla"
                    name="island"
                    value={formData.island}
                    onChange={handleInputChange}
                  >
                    {[
                      "Gran Canaria",
                      "Tenerife",
                      "La Gomera",
                      "Lanzarote",
                      "Fuerteventura",
                      "El Hierro",
                      "La Palma",
                    ].map((isla) => (
                      <MenuItem key={isla} value={isla}>
                        {isla}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Área */}
                <Grid item>
                  <TextField
                    select
                    fullWidth
                    label="Área"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                  >
                    {["movilidad", "sensorial", "arquitectura", "transporte", "otro"].map(
                      (area) => (
                        <MenuItem key={area} value={area}>
                          {area}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                </Grid>

                {/* Estado */}
                <Grid item>
                  <TextField
                    select
                    fullWidth
                    label="Estado"
                    name="incidentStatusId"
                    value={formData.incidentStatusId}
                    onChange={handleInputChange}
                  >
                    <MenuItem value={1}>Pendiente</MenuItem>
                    <MenuItem value={2}>En Progreso</MenuItem>
                    <MenuItem value={3}>Resuelta</MenuItem>
                  </TextField>
                </Grid>

                {/* Tipo */}
                <Grid item>
                  <TextField
                    select
                    fullWidth
                    label="Tipo"
                    name="incidentTypeId"
                    value={formData.incidentTypeId}
                    onChange={handleInputChange}
                  >
                    <MenuItem value={1}>Buena Práctica</MenuItem>
                    <MenuItem value={2}>Mala Práctica</MenuItem>
                  </TextField>
                </Grid>

                {/* Severidad */}
                {Number(formData.incidentTypeId) === 2 && (
                  <Grid item>
                    <TextField
                      select
                      fullWidth
                      label="Severidad"
                      name="incidentSeverityId"
                      value={formData.incidentSeverityId}
                      onChange={handleInputChange}
                    >
                      <MenuItem value={1}>Baja</MenuItem>
                      <MenuItem value={2}>Media</MenuItem>
                      <MenuItem value={3}>Alta</MenuItem>
                    </TextField>
                  </Grid>
                )}

                {/* Latitud */}
                <Grid item>
                  <TextField
                    fullWidth
                    label="Latitud (entre -90 y 90)"
                    name="latitude"
                    type="number"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                {/* Longitud */}
                <Grid item>
                  <TextField
                    fullWidth
                    label="Longitud (entre -180 y 180)"
                    name="longitude"
                    type="number"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                {/* Fecha */}
                <Grid item>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha del incidente"
                    name="dateIncident"
                    value={formData.dateIncident}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Imagen */}
                <Grid item>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                    fullWidth
                  >
                    {formData.nameFile ? "Cambiar Imagen" : "Subir Imagen"}
                    <input
                      type="file"
                      accept="image/*"
                      name="imageFile"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            imageFile: file,
                            previewUrl: URL.createObjectURL(file),
                          });
                        }
                      }}
                    />
                  </Button>
                </Grid>

                {/* Vista previa de imagen */}
                {formData.previewUrl && (
                  <Grid item textAlign="center">
                    <img
                      src={formData.previewUrl}
                      alt="Vista previa"
                      style={{
                        width: "100%",
                        maxWidth: 400,
                        borderRadius: "8px",
                        marginTop: "10px",
                      }}
                    />
                  </Grid>
                )}

                {/* Botón */}
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    {editingIncident ? "Actualizar Incidencia" : "Crear Incidencia"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}

        {/* LISTA DE INCIDENCIAS */}
        {incidents.length === 0 ? (
          <Typography>No hay incidencias registradas.</Typography>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center">
              {paginatedIncidents.map((incident) => (
                <Grid item xs={12} sm={6} md={4} key={incident.id}>
                  <Card
                    sx={{
                      minWidth: 550,
                      maxWidth: 550,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      margin: '0 auto',
                    }}
                  >
                    <CardHeader
                      avatar={
                        (() => {
                          const user = users.find((u) => Number(u.id) === Number(incident.userId));

                          return (
                            <Avatar
                              src={user?.nameFile || undefined}
                              alt={`${user?.firstName} ${user?.lastName}`}
                              sx={{ bgcolor: red[500] }}
                            >
                              {user
                                ? user.firstName?.charAt(0)?.toUpperCase()
                                : "U"}
                            </Avatar>
                          );
                        })()
                      }
                      action={<IconButton><MoreVertIcon /></IconButton>}
                      title={
                        <>
                          {incident.name}
                          <Typography variant="body2" color="text.secondary">
                            Reportado por: {getUserName(incident.userId)}
                          </Typography>
                        </>
                      }
                      subheader={new Date(incident.dateIncident).toLocaleDateString()}
                    />


                    <CardMedia
                      component="img"
                      image={incident.nameFile}
                      alt={incident.name}
                      sx={{
                        width: "100%",
                        maxHeight: expandedId === incident.id ? 768 : 300,
                        objectFit: "cover",
                        objectPosition: "center",
                        transition: "max-height 0.3s ease",
                      }}
                    />


                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {incident.description}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton onClick={() => handleEdit(incident)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(incident.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                      <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                      <ExpandMore
                        expand={expandedId === incident.id}
                        onClick={() => handleExpandClick(incident.id)}
                        aria-expanded={expandedId === incident.id}
                        aria-label="Mostrar más"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </CardActions>
                    <Collapse in={expandedId === incident.id} timeout="auto" unmountOnExit>
                      <CardContent>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Isla: {incident.island || "No especificada"}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Área: {incident.area}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Coordenadas: {incident.latitude}, {incident.longitude}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Tipo: {incident.incidentTypeId === 1 ? "Buena Práctica" : "Mala Práctica"}
                        </Typography>
                        {incident.incidentTypeId === 2 && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Severidad:{" "}
                            {incident.incidentSeverityId === 1
                              ? "Baja"
                              : incident.incidentSeverityId === 2
                                ? "Media"
                                : "Alta"}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          Estado:{" "}
                          {incident.incidentStatusId === 1
                            ? "Pendiente"
                            : incident.incidentStatusId === 2
                              ? "En Progreso"
                              : "Resuelta"}
                        </Typography>
                      </CardContent>
                    </Collapse>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* PAGINACIÓN */}
            {incidents.length > itemsPerPage && (
              <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                />
              </Grid>
            )}
          </>
        )}
      </div>
      <Footer />
    </section>
  );
};

export default Incident;
