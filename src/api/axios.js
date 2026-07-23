import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

export default api;

export function authHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}