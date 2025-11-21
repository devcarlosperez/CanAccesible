import { Button, TextField, MenuItem, Grid, Typography, Dialog, DialogContent } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const IncidentForm = ({
    formData,
    setFormData,
    onSubmit,
    editingIncident,
    onCancel,
    open,
    setOpen,
}) => (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
            <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 4, mt: 2 }}>
                {editingIncident ? "Editar Incidencia" : "Nuevo Incidencia"}
            </Typography>
            <form onSubmit={onSubmit}>
                <Grid container spacing={3} direction="column">
                    {/* Name */}
                    <Grid item>
                        <TextField fullWidth label="Nombre" name="title" value={formData.title} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} required />
                    </Grid>
                    {/* Description */}
                    <Grid item>
                        <TextField fullWidth label="Descripción" name="description" multiline rows={3} value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} required />
                    </Grid>
                    {/* Island */}
                    <Grid item>
                        <TextField 
                        select 
                        fullWidth 
                        label="Isla" 
                        name="island" 
                        value={formData.island} 
                        onChange={e => setFormData(f => ({ ...f, island: e.target.value }))} 
                        required 
                        >
                        <MenuItem value={1}>Gran Canaria</MenuItem>
                        <MenuItem value={2}>Tenerife</MenuItem>
                        <MenuItem value={3}>La Gomera</MenuItem>
                        <MenuItem value={4}>Lanzarote</MenuItem>
                        <MenuItem value={5}>Fuerteventura</MenuItem>
                        <MenuItem value={6}>El Hierro</MenuItem>
                        <MenuItem value={7}>La Palma</MenuItem>
                        </TextField>
                    </Grid>
                    {/* Area */}
                    <Grid item>
                        <TextField 
                        select 
                        fullWidth 
                        label="Area" 
                        name="area" 
                        value={formData.area} 
                        onChange={e => setFormData(f => ({ ...f, area: e.target.value }))} 
                        required 
                        >
                        <MenuItem value={1}>movilidad</MenuItem>
                        <MenuItem value={2}>sensorial</MenuItem>
                        <MenuItem value={3}>arquitectura</MenuItem>
                        <MenuItem value={4}>transporte</MenuItem>
                        <MenuItem value={5}>otro</MenuItem>
                        </TextField>
                    </Grid>
                    {/* Status */}
                    <Grid item>
                        <TextField
                            select
                            fullWidth
                            label="Estado"
                            name="incidentStatusId"
                            value={formData.incidentStatusId}
                            onChange={e => setFormData(f => ({ ...f, incidentStatusId: Number(e.target.value) }))}
                            required
                        >
                            <MenuItem value={1}>Pendiente</MenuItem>
                            <MenuItem value={2}>En progreso</MenuItem>
                            <MenuItem value={3}>Resuelto</MenuItem>
                        </TextField>
                    </Grid>
                    {/* Type */}
                    <Grid item>
                        <TextField
                            select
                            fullWidth
                            label="Tipo"
                            name="incidentTypeId"
                            value={formData.incidentTypeId}
                            onChange={e => setFormData(f => ({ ...f, incidentTypeId: Number(e.target.value) }))}
                            required
                        >
                            <MenuItem value={1}>Buena Practica</MenuItem>
                            <MenuItem value={2}>Mala Practica</MenuItem>
                        </TextField>
                    </Grid>
                    {/* Severity (only if Bad Practice) */}
                    {formData.incidentTypeId === 2 && (
                        <Grid item>
                            <TextField
                                select
                                fullWidth
                                label="Severidad"
                                name="incidentSeverityId"
                                value={formData.incidentSeverityId}
                                onChange={e => setFormData(f => ({ ...f, incidentSeverityId: Number(e.target.value) }))}
                                required
                            >
                                <MenuItem value={1}>Baja</MenuItem>
                                <MenuItem value={2}>Media</MenuItem>
                                <MenuItem value={3}>Alta</MenuItem>
                            </TextField>
                        </Grid>
                    )}
                    {/* Latitude */}
                    <Grid item>
                        <TextField fullWidth label="Latitud (entre -90 y 90)" name="latitude" value={formData.latitude} onChange={e => setFormData(f => ({ ...f, latitude: e.target.value }))} required />
                    </Grid>
                    {/* Longitude */}
                    <Grid item>
                        <TextField fullWidth label="Longitud (entre -180 y 180)" name="longitude" value={formData.longitude} onChange={e => setFormData(f => ({ ...f, longitude: e.target.value }))} required />
                    </Grid>
                    {/* Date */}
                    <Grid item>
                        <TextField
                            fullWidth
                            label="Fecha"
                            name="dateIncident"
                            type="date"
                            value={formData.dateIncident}
                            onChange={e => setFormData(f => ({ ...f, dateIncident: e.target.value }))}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    {/* Image */}
                    <Grid item>
                        <Button variant="outlined" component="label" startIcon={<PhotoCamera />} fullWidth>
                            {formData.nameFile ? "Cambiar Imagen" : "Subir Imagen"}
                            <input type="file" accept="image/*" name="imageFile" hidden onChange={e => {
                                const file = e.target.files[0];
                                if (file) setFormData(f => ({ ...f, imageFile: file, previewUrl: URL.createObjectURL(file) }));
                            }} />
                        </Button>
                    </Grid>
                    {/* Image preview */}
                    {formData.previewUrl && (
                        <Grid item textAlign="center">
                            <img src={formData.previewUrl} alt="Preview" style={{ width: "100%", maxWidth: 400, borderRadius: "8px", marginTop: "10px" }} />
                        </Grid>
                    )}
                    {/* Buttons */}
                    <Grid item>
                        <Button variant="contained" color="success" type="submit" fullWidth sx={{ mt: 2 }}>
                            {editingIncident ? "Actualizar Incidencia" : "Crear Incidencia"}
                        </Button>
                        {onCancel && (
                            <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={onCancel}>
                                Cancelar
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </form>
        </DialogContent>
    </Dialog>
);

export default IncidentForm;