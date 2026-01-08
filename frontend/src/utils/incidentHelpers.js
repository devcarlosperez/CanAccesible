
/**
 * Validates if the incident data has the minimum required fields.
 * Required: name (string > 3 chars), description (string), island (string).
 * @param {Object} data 
 * @returns {boolean}
 */
export const validateIncidentData = (data) => {
    if (!data || typeof data !== 'object') return false;

    const { name, description, island } = data;

    if (!name || typeof name !== 'string' || name.trim().length < 3) return false;
    if (!description || typeof description !== 'string' || description.trim().length === 0) return false;
    if (!island || typeof island !== 'string' || island.trim() === '') return false;

    return true;
};

/**
 * Returns the readable label for a given status ID.
 * @param {number} statusId 
 * @returns {string} translation key or unknown
 */
export const getIncidentStatusLabel = (statusId) => {
    switch (statusId) {
        case 1: return "incident_status_pending";
        case 2: return "incident_status_progress";
        case 3: return "incident_status_resolved";
        case 4: return "incident_status_rejected";
        default: return "incident_status_unknown";
    }
};

/**
 * Checks if latitude and longitude are within valid ranges.
 * Lat: -90 to 90
 * Lng: -180 to 180
 * @param {number} lat 
 * @param {number} lng 
 * @returns {boolean}
 */
export const startCoordinatesValidation = (lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) return false;

    if (latitude < -90 || latitude > 90) return false;
    if (longitude < -180 || longitude > 180) return false;

    return true;
};
