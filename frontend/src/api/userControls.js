import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL:apiUrl,
    withCredentials:true,
})

export const loginUser =  async (email,password)=>{
    try {
        const response = api.post('/login',{email,password})
        return (await response).data;

    } catch (error) {
        throw error.response?.data || error.message;
    }
}

// Register request
export const registerUser = async (fullName, email, password) => {
    try {
        const response = await api.post('/register', { fullName, email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Logout request
export const logoutUser = async () => {
    try {
        const response = await api.post('/logout');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Fetch today's quote
export const fetchTodaysQuote = async () => {
    try {
        const response = await api.get('/get-quote');
        return response.data.quote || "Quote not found";
    } catch (error) {
        console.error("Error fetching quote:", error);
        return "Error fetching quote no quote available for today :(";
    }
};
