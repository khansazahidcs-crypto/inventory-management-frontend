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
                // Logout can fail (expired token, network drop, etc.); we still
                // clear the local session below, so just surface it for debugging
                // instead of leaving a bare console.log in shipped code.
                console.error("Logout request failed:", err);
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
