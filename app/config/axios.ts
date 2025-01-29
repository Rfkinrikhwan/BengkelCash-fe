import axios from "axios";

const BASE_URL = "https://admin-bubutbali.test";

export default axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const axiosConfig = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
