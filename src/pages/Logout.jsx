import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const doLogout = async () => {
            try {
                const token = localStorage.getItem("token");
                await api.post("/logout", {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.log("Logout error", err);
            } finally {
                localStorage.removeItem("token");
                navigate("/login");
            }
        };
        doLogout();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
            Logging out...
        </div>
    );
}

export default Logout;