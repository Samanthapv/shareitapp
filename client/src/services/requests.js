import axios from "axios";

/* Configuration */

// Do something before request is sent
axios.interceptors.request.use(
  (config) => {
    // Grab token
    const token = localStorage.getItem("token");

    // Add header with token to every request
    if (token != null) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Intercept 401 unauthorized responses
axios.interceptors.response.use(
  (response) => {
    // if reponse is ok, just return the response
    return response;
  },
  (error) => {
    // if user is not authorized, remove token
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      // redirect to login page
    }
    return error;
  }
);

// Register
export const register = async (name, username, password) => {
  return await axios.post("/users/register", { name, username, password });
};

// Login
export const login = async (username, password) => {
  return await axios.post("/users/login", { username, password });
};

// Get user profile
export const getProfile = async () => {
  return await axios.get("/users/profile");
};

// Get categories
export const getCategories = async () => {
  return await axios.get("/categories");
};

// Add a product
export const addProduct = async (
  userId,
  name,
  description,
  pricePerDay,
  categoryId
) => {
  return await axios.post("/products", {
    userId,
    name,
    description,
    pricePerDay,
    categoryId,
  });
};
