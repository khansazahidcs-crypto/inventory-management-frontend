function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-6 shadow-md z-10">
            <h2 className="text-lg font-semibold">My Application</h2>
            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300">Welcome back</span>
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium">
                    U
                </div>
            </div>
        </header>
    );
}

export default Header;