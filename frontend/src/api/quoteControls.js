import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

/**
 * Fetch all quotes
 */
export const getAllQuotes = async () => {
  const response = await api.get('/get-all-quotes');
  return response.data.quotes;
};

/**
 * Create a new quote
 */
export const createQuote = async (text, date) => {
  const response = await api.post('/create-quote', { text, date });
  return response.data;
};

/**
 * Edit an existing quote
 */
export const editQuote = async (id, updatedFields) => {
  const response = await api.put('/edit-quote', { id, ...updatedFields });
  return response.data;
};

/**
 * Delete a quote
 */
export const deleteQuote = async (filter) => {
  // filter can be { text } or { date }
  const response = await api.delete('/delete-quote', {
    data: filter,
  });
  return response.data;
};
