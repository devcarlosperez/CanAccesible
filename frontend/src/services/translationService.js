import axios from 'axios';

const API_URL = 'https://api.mymemory.translated.net/get';

const translateChunk = async (text, source, target) => {
  try {
    const params = new URLSearchParams();
    params.append('q', text);
    params.append('langpair', `${source}|${target}`);

    const response = await axios.post(API_URL, params);

    if (response.data && response.data.responseStatus === 200) {
        return response.data.responseData.translatedText;
    }
    console.warn('Translation API warning:', response.data.responseDetails);
    return text;
  } catch (error) {
    console.error('Translation chunk error:', error);
    return text;
  }
};

const splitTextIntoChunks = (text, maxLength) => {
    const chunks = [];
    let currentChunk = "";
    
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    
    for (const sentence of sentences) {
        if (currentChunk.length + sentence.length <= maxLength) {
            currentChunk += sentence;
        } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
            
            while (currentChunk.length > maxLength) {
                let splitIndex = currentChunk.lastIndexOf(' ', maxLength);
                if (splitIndex === -1) splitIndex = maxLength;
                
                chunks.push(currentChunk.slice(0, splitIndex));
                currentChunk = currentChunk.slice(splitIndex).trim();
            }
        }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
};

export const translateText = async (text, source = 'es', target = 'en') => {
  if (!text) return '';
  
  const MAX_CHUNK_SIZE = 450;

  if (text.length <= MAX_CHUNK_SIZE) {
      return translateChunk(text, source, target);
  }

  const chunks = splitTextIntoChunks(text, MAX_CHUNK_SIZE);
  const translatedChunks = [];

  for (const chunk of chunks) {
      const translated = await translateChunk(chunk, source, target);
      translatedChunks.push(translated);
  }
  
  return translatedChunks.join(' ');
};
