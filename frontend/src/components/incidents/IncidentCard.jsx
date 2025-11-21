import {
  Card, CardHeader, CardContent, CardActions, CardMedia, Collapse,
  Avatar, IconButton, Typography
} from "@mui/material";
import { red } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";

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

const IncidentCard = ({
  incident,
  user,
  expanded,
  onExpandClick,
  onEdit,
  onDelete,
}) => (
  <Card sx={{ minWidth: 550, maxWidth: 550, width: '100%', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
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
            Reportado por: {user ? `${user.firstName} ${user.lastName || ""}` : "Desconocido"}
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
        maxHeight: expanded ? 768 : 300,
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
      <ExpandMore
        expand={expanded}
        onClick={() => onExpandClick(incident.id)}
        aria-expanded={expanded}
        aria-label="Mostrar más"
      >
        <ExpandMoreIcon />
      </ExpandMore>
    </CardActions>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
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
);

export default IncidentCard;
