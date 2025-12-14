import axios from 'axios';

const API_URL = 'https://libretranslate.de/translate';

/**
 * Translates text from source language to target language using LibreTranslate.
 * @param {string} text - The text to translate.
 * @param {string} source - The source language code (default: 'es').
 * @param {string} target - The target language code (default: 'en').
 * @returns {Promise<string>} - The translated text.
 */
export const translateText = async (text, source = 'es', target = 'en') => {
  try {
    const response = await axios.post(API_URL, {
      q: text,
      source: source,
      target: target,
      format: 'text'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};
