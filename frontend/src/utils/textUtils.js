/**
 * Truncates a string to a specified length and adds an ellipsis if truncated.
 * 
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum length of the text.
 * @returns {string} - The truncated text or the original text.
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

/**
 * Validates if a string is a valid non-empty message for chat.
 * 
 * @param {string} message - The message to validate.
 * @returns {boolean} - True if valid.
 */
export const isValidMessage = (message) => {
    if (typeof message !== 'string') return false;
    return message.trim().length > 0;
};
