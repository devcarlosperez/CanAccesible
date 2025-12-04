import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import {
  getCommentsByIncident,
  createIncidentComment,
} from "../../services/incidentCommentService";
import useAuthStore from "../../services/authService";

const IncidentCommentSection = ({ incidentId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const MAX_COMMENT_LENGTH = 500;

  useEffect(() => {
    if (incidentId) {
      fetchComments();
    }
  }, [incidentId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getCommentsByIncident(incidentId);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para comentar");
      return;
    }

    if (!newComment.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    if (newComment.length > MAX_COMMENT_LENGTH) {
      toast.error(
        `El comentario no puede exceder ${MAX_COMMENT_LENGTH} caracteres`
      );
      return;
    }

    try {
      setSubmitting(true);
      await createIncidentComment({
        incidentId,
        comment: newComment.trim(),
      });
      setNewComment("");
      fetchComments();
      toast.success("Comentario publicado exitosamente");
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Error al publicar el comentario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Comentarios ({comments.length})
      </Typography>

      {/* Comment Form */}
      {isAuthenticated && (
        <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            disabled={submitting}
            helperText={`${newComment.length}/${MAX_COMMENT_LENGTH} caracteres`}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              endIcon={
                submitting ? <CircularProgress size={20} /> : <SendIcon />
              }
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? "Publicando..." : "Publicar"}
            </Button>
          </Box>
        </Box>
      )}

      {!isAuthenticated && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.100" }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Debes iniciar sesión para comentar
          </Typography>
        </Paper>
      )}

      <Divider sx={{ mb: 2 }} />

      {/* Comments List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : comments.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ py: 3 }}
        >
          No hay comentarios aún. ¡Sé el primero en comentar!
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {comments.map((comment) => (
            <Paper key={comment.id} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar
                  src={comment.user?.nameFile || undefined}
                  sx={{ bgcolor: "primary.main", width: 40, height: 40 }}
                >
                  {comment.user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {comment.user?.firstName} {comment.user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                    {comment.comment}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default IncidentCommentSection;
