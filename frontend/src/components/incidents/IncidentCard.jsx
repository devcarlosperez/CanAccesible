import {
  Card, CardHeader, CardContent, CardActions, CardMedia,
  Avatar, IconButton, Typography, Button, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { red } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

const IncidentCard = ({
  incident,
  user,
  onEdit,
  onDelete,
  openViewMore,
  handleCloseViewMore,
}) => {
  const [openModal, setOpenModal] = useState(false);
  
  useEffect(() => {
    if (openViewMore) setOpenModal(true);
  }, [openViewMore]);

  const handleCloseModal = () => {
    setOpenModal(false);
    if (handleCloseViewMore) handleCloseViewMore();
  };

  return (
    <>
      <Card sx={{ minWidth: 400, maxWidth: 550, width: '100%', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
        <CardHeader
          avatar={
            <Avatar src={user?.nameFile || undefined} alt={`${user?.firstName} ${user?.lastName}`} sx={{ bgcolor: red[500] }}>
              {user ? user.firstName?.charAt(0)?.toUpperCase() : "U"}
            </Avatar>
          }
          action={<IconButton><MoreVertIcon /></IconButton>}
          title={
            <>
              {incident.name}
              <Typography variant="body2" color="text.secondary">
                Reportado por: {user ? `${user.firstName} ${user.lastName || ""}` : "Unknown"}
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
            maxHeight: 300,
            objectFit: "cover",
            objectPosition: "center",
            transition: "max-height 0.3s ease",
          }}
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              minHeight: 40,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {incident.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={() => onEdit(incident)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(incident.id)}>
            <DeleteIcon color="error" />
          </IconButton>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <Button
            variant="outlined"
            sx={{ marginLeft: "auto" }}
            onClick={() => setOpenModal(true)}
          >
            Ver más
          </Button>
        </CardActions>
      </Card>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {incident.name}
          <IconButton edge="end" color="inherit" onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto', maxHeight: '70vh' }}>
          <Typography variant="body2" sx={{ mb: 4, mt: 2, textAlign: 'justify' }}>
            {incident.description}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Isla: {incident.island || "Not specified"}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Area: {incident.area}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Coordenadas: {incident.latitude}, {incident.longitude}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tipo: {incident.incidentTypeId === 1 ? "Buena Practica" : "Mala Practica"}
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
          <Typography variant="body2" sx={{ mb: 1 }}>
            Estado:{" "}
            {incident.incidentStatusId === 1
              ? "Pendiente"
              : incident.incidentStatusId === 2
                ? "En progreso"
                : "Resuelto"}
          </Typography>
          {incident.nameFile && (
            <img
              className="w-full mt-4 border-2 rounded"
              src={incident.nameFile}
              alt={incident.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncidentCard;
