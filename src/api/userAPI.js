import axios from "axios";


const API_URL = process.env.REACT_APP_API_URL;
const TOKEN = process.env.REACT_APP_API_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`, // même si JSONPlaceholder ne le demande pas
    "Content-Type": "application/json",
  },
});

/**
 * Retrieves list of users from the API
 * @returns {Promise<Array>} List of users
 * @throws {Error} SERVER_ERROR on server failure (5xx)
 */
export const getUsers = async () => {
    try {
        const response = axiosInstance.get(API_URL);
        return response.data;
    } catch (error) {
        if (error.response?.status >= 500) {
            throw new Error("SERVER_ERROR");
        }
        throw new Error("SERVER_ERROR");
    }
}

/**
 * Creates a new user via the API
 * @param {Object} user - User data to create
 * @returns {Promise<Object>} Created user data
 * @throws {Error} EMAIL_EXISTS if email already exists (400)
 * @throws {Error} SERVER_ERROR on server failure (5xx)
 */
export const createUser = async (user) => {
    try {
        const response = axiosInstance.post(API_URL, user);
        return response.data;
    } catch (error) {
        // Business error: Email already exists
        if (error.response?.status === 400) {
            throw new Error(error.response.data.message || "EMAIL_EXISTS");
        }

        // Server error: 5xx status codes
        if (error.response?.status >= 500) {
            throw new Error("SERVER_ERROR");
        }

        // Network or unknown error
        throw new Error("SERVER_ERROR");
    }
}