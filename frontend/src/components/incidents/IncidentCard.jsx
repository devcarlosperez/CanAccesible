import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { Card, CardHeader, CardContent, CardActions, CardMedia, Avatar, IconButton, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, InputAdornment } from "@mui/material";
import { red } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TranslateIcon from "@mui/icons-material/Translate";

import { getIncidentLikeByIncidentAndUserId } from "../../services/incidentLikesService";
import { getIncidentFollowByIncidentAndUserId } from "../../services/incidentFollowsService";
import useAuthStore from "../../services/authService.js";
import { translateText } from "../../services/translationService";
import { useIncidentTranslationStore } from "../../stores/incidentTranslationStore";


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

  // Translation Store
  const { 
    isTranslated: getIsTranslated, 
    getTranslation, 
    setTranslatedText, 
    toggleTranslationStatus 
  } = useIncidentTranslationStore();

  const isTranslated = getIsTranslated(incident.id);
  const cachedTranslation = getTranslation(incident.id);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);

  const shareUrl = `${window.location.origin}/incidents/${incident?.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTranslate = async (e) => {
    e.stopPropagation();

    if (isTranslated) {
      toggleTranslationStatus(incident.id);
      return;
    }

    if (cachedTranslation?.title && cachedTranslation?.description) {
      toggleTranslationStatus(incident.id);
      return;
    }

    setIsLoadingTranslation(true);
    try {
      const [title, description] = await Promise.all([
        translateText(incident.name),
        translateText(incident.description)
      ]);
      setTranslatedText(incident.id, { title, description });
      toggleTranslationStatus(incident.id);
    } catch (error) {
      console.error('Failed to translate:', error);
    } finally {
      setIsLoadingTranslation(false);
    }
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
  };// 

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
              {isTranslated && cachedTranslation?.title ? cachedTranslation.title : incident.name}
              <Typography variant="body2" color="text.secondary">
                {isTranslated ? "Reported by: " : "Reportado por: "}
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
            {isTranslated && cachedTranslation?.description ? cachedTranslation.description : incident.description}
          </Typography>
        </CardContent>

        {/* Incident buttons */}
        <CardActions disableSpacing>
          {/* Like, follow and share buttons */}
          <IconButton onClick={handleLikeClick} aria-label="dar me gusta">
            <FavoriteIcon sx={{ color: liked ? "red" : "inherit" }} />
          </IconButton>
          <IconButton onClick={handleFollowClick} aria-label="seguir">
            <NotificationsIcon
              sx={{ color: followed ? "rgb(255,180,0)" : "inherit" }}
            />
          </IconButton>

          {/* Botón compartir modificado */}
          <IconButton aria-label="share" onClick={() => setOpenShare(true)}>
            <ShareIcon />
          </IconButton>

          {/* Translate Button */}
          <button
            onClick={handleTranslate}
            disabled={isLoadingTranslation}
            className={`text-xs px-2 py-1 rounded transition-colors mr-2 cursor-pointer ${
              isTranslated 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
            title={isTranslated ? "Traducido al inglés (Click para ver original)" : "Original en español (Click para traducir)"}
          >
            {isLoadingTranslation ? (
              <span className="animate-pulse">...</span>
            ) : (
              isTranslated ? 'EN' : 'ES'
            )}
          </button>

          {/* Edit and delete buttons */}
          {user?.id === incident.userId && (
            <>
              <IconButton onClick={() => onEdit(incident)} aria-label="editar">
                <EditIcon color="info" />
              </IconButton>
              <IconButton onClick={() => onDelete(incident.id)} aria-label="eliminar">
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )}

          {/* More information button */}
          <Button
            component={RouterLink}
            to={`/incidents/${incident.id}`}
            sx={{ marginLeft: "auto" }}
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
            {isTranslated ? "Share Incident" : "Compartir Incidencia"}
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
                  <IconButton onClick={handleCopy} edge="end" aria-label="copiar enlace">
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
              {isTranslated ? "Link copied to clipboard!" : "Enlace copiado al portapapeles!"}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncidentCard;
