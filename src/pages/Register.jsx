import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [errors, setErrors] = useState({});

    const register = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const response = await api.post("/register", form);
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            setErrors(err.response?.data?.errors || { general: ["Registration failed."] });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Register</h2>

                {Object.keys(errors).length > 0 && (
                    <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
                        {Object.values(errors).flat().map((msg, i) => (
                            <div key={i}>{msg}</div>
                        ))}
                    </div>
                )}

                <form onSubmit={register} className="flex flex-col gap-4">
                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    />
                    <input
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={form.password_confirmation}
                        onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    />
                    <button
                        type="submit"
                        className="bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-md py-2 transition-colors"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-slate-400 mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-slate-200 underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;