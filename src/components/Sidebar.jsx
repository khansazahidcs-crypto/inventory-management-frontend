import { NavLink } from "react-router-dom";

function Sidebar() {
    const linkClasses = ({ isActive }) =>
        `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <aside className="fixed top-16 left-0 bottom-0 w-60 bg-slate-900 border-r border-slate-800 p-4">
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