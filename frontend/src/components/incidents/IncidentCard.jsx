import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardContent, CardActions, CardMedia, Avatar, IconButton, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, InputAdornment } from "@mui/material";
import { red } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { getIncidentLikeByIncidentAndUserId } from "../../services/incidentLikesService";
import { getIncidentFollowByIncidentAndUserId } from "../../services/incidentFollowsService";
import useAuthStore from "../../services/authService.js";


const IncidentCard = ({
  incident,
  incidentUser,
  onLike,
  onFollow,
  onEdit,
  onDelete,
}) => {
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);

  // Estados para compartir
  const [openShare, setOpenShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const shareUrl = `${window.location.origin}/incidents/${incident?.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (user && user.id && incident && incident.id) {
      getIncidentLikeByIncidentAndUserId(incident.id, user.id).then((like) => {
        setLiked(!!like);
      });
    }

    if (user && user.id && incident && incident.id) {
      getIncidentFollowByIncidentAndUserId(incident.id, user.id).then(
        (follow) => {
          setFollowed(!!follow);
        }
      );
    }
  }, [incident.likes, incident.id, user?.id]);

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

  const handleViewMore = () => {
    navigate(`/incidents/${incident.id}`);
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 500,
          width: 500,
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
            height: 300,
            objectFit: "cover",
            objectPosition: "center",
            transition: "max-height 0.3s ease",
            cursor: "pointer"
          }}
          onClick={handleViewMore}
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
            onClick={handleViewMore}
          >
            Ver más
          </Button>
        </CardActions>
      </Card>

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
