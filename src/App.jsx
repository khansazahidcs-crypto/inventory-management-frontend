import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoryList from "./pages/categories/CategoryList";
import BrandList from "./pages/brands/BrandList";
import SupplierList from "./pages/suppliers/SupplierList";
import CustomerList from "./pages/customers/CustomerList";
import ProductList from "./pages/products/ProductList";
import PurchaseList from "./pages/purchases/PurchaseList";
import PurchaseCreate from "./pages/purchases/PurchaseCreate";
import InventoryList from "./pages/inventory/InventoryList";
import StockHistory from "./pages/inventory/StockHistory";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute>
                            <CategoryList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/brands"
                    element={
                        <ProtectedRoute>
                            <BrandList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/suppliers"
                    element={
                        <ProtectedRoute>
                            <SupplierList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <CustomerList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <ProductList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/purchases"
                    element={
                        <ProtectedRoute>
                            <PurchaseList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/purchases/new"
                    element={
                        <ProtectedRoute>
                            <PurchaseCreate />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/inventory"
                    element={
                        <ProtectedRoute>
                            <InventoryList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/inventory/:id/history"
                    element={
                        <ProtectedRoute>
                            <StockHistory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/logout"
                    element={
                        <ProtectedRoute>
                            <Logout />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
