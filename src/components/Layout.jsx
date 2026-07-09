import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Header />
            <div className="flex flex-1 pt-16">
                <Sidebar />
                <main className="ml-60 flex-1 p-8">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Layout;