import { Grid, Pagination, Typography } from "@mui/material";
import IncidentCard from "./IncidentCard";

const IncidentList = ({
  incidents,
  onLike,
  onFollow,
  onEdit,
  onDelete,
  page,
  setPage,
  itemsPerPage,
  viewMoreIncidentId,
  handleCloseViewMore,
}) => {
  const approvedIncidents = incidents.filter(incident => incident.isApproved);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIncidents = approvedIncidents.slice(startIndex, endIndex);
  const pageCount = Math.ceil(approvedIncidents.length / itemsPerPage);

  return approvedIncidents.length === 0 ? (
    <Typography>No hay incidencias registradas.</Typography>
  ) : (
    <>
      <Grid container spacing={3} justifyContent="center">
        {paginatedIncidents.map((incident) => {
          const user = incident.user;

          return (
            <Grid item xs={12} sm={6} md={4} key={incident.id}>
              <IncidentCard
                incident={incident}
                incidentUser={user}
                onLike={onLike}
                onFollow={onFollow}
                onEdit={onEdit}
                onDelete={onDelete}
                openViewMore={String(incident.id) === String(viewMoreIncidentId)}
                handleCloseViewMore={handleCloseViewMore}
              />
            </Grid>
          );
        })}
      </Grid>
      {approvedIncidents.length > itemsPerPage && (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => {
              setPage(value);
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            color="primary"
          />
        </Grid>
      )}
    </>
  );
};

export default IncidentList;
