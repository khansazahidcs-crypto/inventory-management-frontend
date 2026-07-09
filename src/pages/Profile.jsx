import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordSuccess, setPasswordSuccess] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/user", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (err) {
                setError("Failed to load profile.");
                navigate("/login");
            }
        };
        fetchUser();
    }, [navigate]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordErrors({});
        setPasswordSuccess("");
        try {
            const token = localStorage.getItem("token");
            const response = await api.post("/change-password", passwordForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPasswordSuccess(response.data.message);
            setPasswordForm({
                current_password: "",
                new_password: "",
                new_password_confirmation: ""
            });
        } catch (err) {
            if (err.response?.data?.errors) {
                setPasswordErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setPasswordErrors({ general: [err.response.data.message] });
            } else {
                setPasswordErrors({ general: ["Something went wrong."] });
            }
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            {error && <p className="text-red-400">{error}</p>}

            {user && (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md mb-8">
                    <p className="text-slate-400 text-sm mb-1">Name</p>
                    <p className="text-white mb-4">{user.name}</p>
                    <p className="text-slate-400 text-sm mb-1">Email</p>
                    <p className="text-white">{user.email}</p>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>

                {passwordSuccess && (
                    <div className="mb-4 text-sm text-green-400 bg-green-950/40 border border-green-900 rounded-md px-3 py-2">
                        {passwordSuccess}
                    </div>
                )}

                {Object.keys(passwordErrors).length > 0 && (
                    <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
                        {Object.values(passwordErrors).flat().map((msg, i) => (
                            <div key={i}>{msg}</div>
                        ))}
                    </div>
                )}

                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={passwordForm.current_password}
                        onChange={(e) =>
                            setPasswordForm({ ...passwordForm, current_password: e.target.value })
                        }
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={passwordForm.new_password}
                        onChange={(e) =>
                            setPasswordForm({ ...passwordForm, new_password: e.target.value })
                        }
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={passwordForm.new_password_confirmation}
                        onChange={(e) =>
                            setPasswordForm({
                                ...passwordForm,
                                new_password_confirmation: e.target.value
                            })
                        }
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    />
                    <button
                        type="submit"
                        className="bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-md py-2 transition-colors"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </Layout>
    );
}

export default Profile;