import api from "./axios";
import { authHeaders } from "./axios";

/**
 * Generic CRUD service factory.
 * Every module (categories, brands, suppliers, customers, products)
 * uses the same 5 endpoints, so we build one reusable service instead
 * of repeating this code per module.
 *
 * hasFile: true means create/update must be sent as multipart/form-data
 * (needed for Brand "logo" and Product "image").
 */
export function createResourceService(resource, { hasFile = false } = {}) {
  return {
    list: (params = {}) => api.get(`/${resource}`, { params, headers: authHeaders() }),

    get: (id) => api.get(`/${resource}/${id}`, { headers: authHeaders() }),

    create: (data) => {
      if (hasFile) {
        return api.post(`/${resource}`, toFormData(data), {
          headers: { "Content-Type": "multipart/form-data", ...authHeaders() },
        });
      }
      return api.post(`/${resource}`, data, { headers: authHeaders() });
    },

    update: (id, data) => {
      if (hasFile) {
        const formData = toFormData(data);
        formData.append("_method", "PUT");
        return api.post(`/${resource}/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data", ...authHeaders() },
        });
      }
      return api.put(`/${resource}/${id}`, data, { headers: authHeaders() });
    },

    remove: (id) => api.delete(`/${resource}/${id}`, { headers: authHeaders() }),
  };
}

function toFormData(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
    } else {
      formData.append(key, value);
    }
  });
  return formData;
}

export const categoryService = createResourceService("categories");
export const brandService = createResourceService("brands", { hasFile: true });
export const supplierService = createResourceService("suppliers");
export const customerService = createResourceService("customers");
export const productService = createResourceService("products", { hasFile: true });
export const purchaseService = createResourceService("purchases");

export const saleService = {
  ...createResourceService("sales"),
  complete: (id) => api.post(`/sales/${id}/complete`, {}, { headers: authHeaders() }),
  cancel: (id) => api.post(`/sales/${id}/cancel`, {}, { headers: authHeaders() }),
};

export const inventoryService = {
  list: (params = {}) => api.get("/inventory", { params, headers: authHeaders() }),
  history: (productId, params = {}) =>
    api.get(`/inventory/${productId}/stock-history`, { params, headers: authHeaders() }),
};

export const dashboardService = {
  summary: () => api.get("/dashboard/summary", { headers: authHeaders() }),
};

export const roleService = {
  ...createResourceService("roles"),
  permissions: () => api.get("/permissions", { headers: authHeaders() }),
};

export const userService = createResourceService("users");

export const settingService = {
  list: () => api.get("/settings", { headers: authHeaders() }),
  update: (settings) => api.put("/settings", { settings }, { headers: authHeaders() }),
};

export const activityLogService = {
  list: (params = {}) => api.get("/activity-logs", { params, headers: authHeaders() }),
};

export const reportService = {
  sales: (params = {}) => api.get("/reports/sales", { params, headers: authHeaders() }),
  purchases: (params = {}) => api.get("/reports/purchases", { params, headers: authHeaders() }),
  stock: (params = {}) => api.get("/reports/stock", { params, headers: authHeaders() }),

  // Exports return a raw CSV file, so they need a manual authenticated fetch
  // (a plain <a href> can't attach the Authorization header) that turns the
  // response into a blob and triggers a browser download.
  downloadCsv: async (reportType, params = {}, filename) => {
    const response = await api.get(`/reports/${reportType}/export`, {
      params,
      headers: authHeaders(),
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename || `${reportType}-report.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};