import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";
import {
  getCommentsByIncident,
  createIncidentComment,
  updateIncidentComment,
  deleteIncidentComment,
} from "../../services/incidentCommentService";
import useAuthStore from "../../services/authService";
import { initSocket } from "../../services/socketService";

const IncidentCommentSection = ({ incidentId }) => {
  const { t, i18n } = useTranslation();
  const [comments, setComments] = useState([]);
  const [displayedComments, setDisplayedComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { isAuthenticated, user } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editedComment, setEditedComment] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const observerRef = useRef();
  const commentsPerLoad = 10;

  const MAX_COMMENT_LENGTH = 500;

  useEffect(() => {
    if (incidentId) {
      fetchComments();

      const token = localStorage.getItem("token");
      const socket = initSocket(token);
      socket.emit("joinIncident", incidentId);

      const handleCommentCreated = (newComment) => {
        setComments((prev) => {
          if (prev.some((c) => c.id === newComment.id)) return prev;
          return [newComment, ...prev];
        });
        setDisplayedComments((prev) => {
          if (prev.some((c) => c.id === newComment.id)) return prev;
          return [newComment, ...prev];
        });
      };

      const handleCommentUpdated = (updatedComment) => {
        setComments((prev) =>
          prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
        );
        setDisplayedComments((prev) =>
          prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
        );
      };

      const handleCommentDeleted = (commentId) => {
        setComments((prev) => prev.filter((c) => c.id !== parseInt(commentId)));
        setDisplayedComments((prev) =>
          prev.filter((c) => c.id !== parseInt(commentId))
        );
      };

      socket.on("comment_created", handleCommentCreated);
      socket.on("comment_updated", handleCommentUpdated);
      socket.on("comment_deleted", handleCommentDeleted);

      return () => {
        socket.emit("leaveIncident", incidentId);
        socket.off("comment_created", handleCommentCreated);
        socket.off("comment_updated", handleCommentUpdated);
        socket.off("comment_deleted", handleCommentDeleted);
      };
    }
  }, [incidentId]);

  useEffect(() => {
    if (comments.length > 0) {
      loadMoreComments();
    }
  }, [comments]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getCommentsByIncident(incidentId);
      setComments(data);
      setDisplayedComments([]);
      setHasMore(data.length > commentsPerLoad);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = useCallback(() => {
    if (loadingMore) return;

    setLoadingMore(true);
    const currentLength = displayedComments.length;
    const nextComments = comments.slice(
      currentLength,
      currentLength + commentsPerLoad
    );

    setTimeout(() => {
      setDisplayedComments((prev) => [...prev, ...nextComments]);
      setHasMore(currentLength + nextComments.length < comments.length);
      setLoadingMore(false);
    }, 300);
  }, [comments, displayedComments, loadingMore]);

  const lastCommentRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreComments();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMoreComments]
  );

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error(t('comments_login_required'));
      return;
    }

    if (!newComment.trim()) {
      toast.error(t('comments_empty_error'));
      return;
    }

    if (newComment.length > MAX_COMMENT_LENGTH) {
      toast.error(t('comments_max_length', { max: MAX_COMMENT_LENGTH }));
      return;
    }

    try {
      setSubmitting(true);
      await createIncidentComment({
        incidentId,
        comment: newComment.trim(),
      });
      setNewComment("");
      // fetchComments(); // Removed to prevent list reset, handled by socket
      toast.success(t('comments_published'));
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error(t('comments_publish_error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMenuOpen = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  const handleEditClick = () => {
    setCommentToEdit(selectedComment);
    setEditedComment(selectedComment.comment);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setCommentToDelete(selectedComment);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    if (!editedComment.trim()) {
      toast.error(t('comments_empty_error'));
      return;
    }

    if (editedComment.length > MAX_COMMENT_LENGTH) {
      toast.error(t('comments_max_length', { max: MAX_COMMENT_LENGTH }));
      return;
    }

    try {
      setUpdating(true);
      await updateIncidentComment(commentToEdit.id, {
        comment: editedComment.trim(),
      });
      setEditDialogOpen(false);
      setCommentToEdit(null);
      // fetchComments(); // Removed to prevent list reset, handled by socket
      toast.success(t('comments_updated'));
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(t('comments_update_error'));
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    try {
      setDeleting(true);
      await deleteIncidentComment(commentToDelete.id);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      // fetchComments(); // Removed to prevent list reset, handled by socket
      toast.success(t('comments_deleted'));
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(t('comments_delete_error'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        {t('comments_title')} ({comments.length})
      </Typography>

      {/* Comment Form */}
      {isAuthenticated && (
        <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={t('comments_placeholder')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            disabled={submitting}
            helperText={t('comments_characters', { current: newComment.length, max: MAX_COMMENT_LENGTH })}
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
              {submitting ? t('comments_publishing') : t('comments_publish')}
            </Button>
          </Box>
        </Box>
      )}

      {!isAuthenticated && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.100" }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {t('comments_login_required')}
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
          {t('comments_be_first')}
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: "400px",
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "grey.200",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "grey.400",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "grey.500",
              },
            },
          }}
        >
          {displayedComments.map((comment, index) => (
            <Paper
              key={comment.id}
              sx={{ p: 2 }}
              ref={
                index === displayedComments.length - 1 ? lastCommentRef : null
              }
            >
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
                      {new Date(comment.createdAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'es-ES', {
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
                {user && user.id === comment.userId && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, comment)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </Box>
            </Paper>
          ))}

          {loadingMore && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!hasMore && displayedComments.length > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ py: 2 }}
            >
              {t('comments_no_more')}
            </Typography>
          )}
        </Box>
      )}

      {/* Menu de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>{t('edit')}</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          {t('delete')}
        </MenuItem>
      </Menu>

      {/* Dialog para editar */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('comments_edit_title')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            variant="outlined"
            disabled={updating}
            helperText={t('comments_characters', { current: editedComment.length, max: MAX_COMMENT_LENGTH })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={updating}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={updating || !editedComment.trim()}
          >
            {updating ? t('comments_saving') : t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('comments_delete_title')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('comments_delete_confirm')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? t('comments_deleting') : t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncidentCommentSection;
