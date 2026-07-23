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