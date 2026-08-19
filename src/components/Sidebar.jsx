import { NavLink } from "react-router-dom";
import usePermissions from "../hooks/usePermissions";

function Sidebar() {
    const { hasPermission } = usePermissions();

    const linkClasses = ({ isActive }) =>
        `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`;

    const showAdminSection =
        hasPermission("roles.manage") ||
        hasPermission("users.manage") ||
        hasPermission("settings.manage") ||
        hasPermission("activity_logs.view");

    return (
        <aside className="fixed top-16 left-0 bottom-0 w-60 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto">
            <h3 className="text-xs uppercase text-slate-500 font-semibold mb-3 px-2">
                Menu
            </h3>
            <nav className="flex flex-col gap-1">
                <NavLink to="/dashboard" className={linkClasses}>
                    Dashboard
                </NavLink>
                <NavLink to="/purchases" className={linkClasses}>
                    Purchases
                </NavLink>
                <NavLink to="/sales" className={linkClasses}>
                    Sales
                </NavLink>
                <NavLink to="/inventory" className={linkClasses}>
                    Inventory
                </NavLink>
                <h3 className="text-xs uppercase text-slate-500 font-semibold mt-4 mb-1 px-2">
                    Reports
                </h3>
                <NavLink to="/reports/sales" className={linkClasses}>
                    Sales Report
                </NavLink>
                <NavLink to="/reports/purchases" className={linkClasses}>
                    Purchases Report
                </NavLink>
                <NavLink to="/reports/stock" className={linkClasses}>
                    Stock Report
                </NavLink>
                {showAdminSection && (
                    <>
                        <h3 className="text-xs uppercase text-slate-500 font-semibold mt-4 mb-1 px-2">
                            Administration
                        </h3>
                        {hasPermission("roles.manage") && (
                            <NavLink to="/roles" className={linkClasses}>
                                Roles
                            </NavLink>
                        )}
                        {hasPermission("users.manage") && (
                            <NavLink to="/users" className={linkClasses}>
                                Users
                            </NavLink>
                        )}
                        {hasPermission("settings.manage") && (
                            <NavLink to="/settings" className={linkClasses}>
                                Settings
                            </NavLink>
                        )}
                        {hasPermission("activity_logs.view") && (
                            <NavLink to="/activity-logs" className={linkClasses}>
                                Activity Logs
                            </NavLink>
                        )}
                    </>
                )}
                <NavLink to="/profile" className={linkClasses}>
                    Profile
                </NavLink>
                <NavLink to="/logout" className={linkClasses}>
                    Logout
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;