import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const login = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await api.post("/login", form);
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Login</h2>

                {error && (
                    <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={login} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    />
                    <button
                        type="submit"
                        className="bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-md py-2 transition-colors"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-slate-400 mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-slate-200 underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;