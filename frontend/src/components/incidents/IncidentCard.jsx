import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment, // Agregado
} from "@mui/material";
import { red } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Agregado
import { useState, useEffect } from "react";
import {
  getAllIncidentLikes,
  getIncidentLikeByIncidentAndUserId,
} from "../../services/incidentLikesService";
import { getIncidentFollowByIncidentAndUserId } from "../../services/incidentFollowsService";
import IncidentCommentSection from "./IncidentCommentSection";

import useAuthStore from "../../services/authService.js";

const IncidentCard = ({
  incident,
  incidentUser,
  onLike,
  onFollow,
  onEdit,
  onDelete,
  openViewMore,
  handleCloseViewMore,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Estados para compartir
  const [openShare, setOpenShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const { user } = useAuthStore();

  const shareUrl = `${window.location.origin}/incidents?incidentId=${incident?.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (openViewMore) setOpenModal(true);

    if (user && user.id && incident && incident.id) {
      getIncidentLikeByIncidentAndUserId(incident.id, user.id).then((like) => {
        setLiked(!!like);
      });
    }

    if (openModal && incident.id) {
      getAllIncidentLikes().then((likes) => {
        const incidentLikes = likes.filter(
          (like) => like.incidentId === incident.id
        );
        setLikeCount(incidentLikes.length);
      });
    }

    if (user && user.id && incident && incident.id) {
      getIncidentFollowByIncidentAndUserId(incident.id, user.id).then(
        (follow) => {
          setFollowed(!!follow);
        }
      );
    }
  }, [openViewMore, openModal, incident.likes, incident.id, user?.id]);

  const handleLikeClick = async () => {
    await onLike(incident);
    if (user && user.id && incident && incident.id) {
      getIncidentLikeByIncidentAndUserId(incident.id, user.id).then((like) => {
        setLiked(!!like);
      });
    }
  };

  const handleFollowClick = async () => {
    await onFollow(incident);
    if (user && user.id && incident && incident.id) {
      getIncidentFollowByIncidentAndUserId(incident.id, user.id).then(
        (follow) => {
          setFollowed(!!follow);
        }
      );
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    if (handleCloseViewMore) handleCloseViewMore();
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
        }}
      >
        {/* Incident header (incident creator and title) */}
        <CardHeader
          avatar={
            <Avatar
              src={incidentUser?.nameFile || undefined}
              alt={`${incidentUser?.firstName} ${incidentUser?.lastName}`}
              sx={{ bgcolor: red[500] }}
            >
              {incidentUser
                ? incidentUser.firstName?.charAt(0)?.toUpperCase()
                : "U"}
            </Avatar>
          }
          title={
            <>
              {incident.name}
              <Typography variant="body2" color="text.secondary">
                Reportado por:{" "}
                {incidentUser
                  ? `${incidentUser.firstName} ${incidentUser.lastName || ""}`
                  : "Unknown"}
              </Typography>
            </>
          }
          subheader={new Date(incident.dateIncident).toLocaleDateString()}
        />

        {/* Incident image */}
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

        {/* Incident buttons */}
        <CardActions disableSpacing>
          {/* Like, follow and share buttons */}
          <IconButton onClick={handleLikeClick}>
            <FavoriteIcon sx={{ color: liked ? "red" : "inherit" }} />
          </IconButton>
          <IconButton onClick={handleFollowClick}>
            <NotificationsIcon
              sx={{ color: followed ? "rgb(255,180,0)" : "inherit" }}
            />
          </IconButton>

          {/* Botón compartir modificado */}
          <IconButton aria-label="share" onClick={() => setOpenShare(true)}>
            <ShareIcon />
          </IconButton>

          {/* Edit and delete buttons */}
          {user?.id === incident.userId && (
            <>
              <IconButton onClick={() => onEdit(incident)}>
                <EditIcon color="info" />
              </IconButton>
              <IconButton onClick={() => onDelete(incident.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )}

          {/* More information button */}
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
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        {/* Incident title */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {incident.name}
          <IconButton edge="end" color="inherit" onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Incident information */}
        <DialogContent sx={{ overflowY: "auto", maxHeight: "70vh" }}>
          <Typography
            variant="body2"
            sx={{ mb: 4, mt: 2, textAlign: "justify" }}
          >
            {incident.description}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Isla: {incident.island || "Not specified"}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Area: {incident.area}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tipo:{" "}
            {incident.incidentTypeId === 1 ? "Buena Practica" : "Mala Practica"}
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

          {/* Incident image */}
          {incident.nameFile && (
            <img
              className="w-full mt-4 mb-3 border-2 rounded"
              src={incident.nameFile}
              alt={incident.name}
            />
          )}

          {/* Incident buttons */}
          <Typography variant="body1" sx={{ mb: 1 }}>
            {likeCount} <FavoriteIcon sx={{ color: "red" }}></FavoriteIcon>
          </Typography>

          {/* Comments Section */}
          <IncidentCommentSection incidentId={incident.id} />
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog
        open={openShare}
        onClose={() => setOpenShare(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
            Compartir Incidencia
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setOpenShare(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={shareUrl}
            variant="outlined"
            size="small"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCopy} edge="end">
                    <ContentCopyIcon color={copied ? "success" : "inherit"} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mt: 1 }}
          />
          {copied && (
            <Typography
              variant="caption"
              color="success.main"
              display="block"
              textAlign="center"
              sx={{ mt: 1 }}
            >
              Enlace copiado al portapapeles!
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncidentCard;
