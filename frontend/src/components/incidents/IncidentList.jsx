import { Grid, Pagination, Typography } from "@mui/material";
import IncidentCard from "./IncidentCard";

const IncidentList = ({
  incidents,
  onEdit,
  onDelete,
  page,
  setPage,
  itemsPerPage,
  viewMoreIncidentId,
  handleCloseViewMore,
}) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIncidents = incidents.slice(startIndex, endIndex);
  const pageCount = Math.ceil(incidents.length / itemsPerPage);

  return incidents.length === 0 ? (
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
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
                openViewMore={String(incident.id) === String(viewMoreIncidentId)}
                handleCloseViewMore={handleCloseViewMore}
              />
            </Grid>
          );
        })}
      </Grid>
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
  );
};

export default IncidentList;
