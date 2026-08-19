import { useEffect, useState, useCallback } from "react";

/**
 * Shared state + logic for a module's list page: fetching, searching,
 * pagination, and add/edit/delete modal handling. All 5 module pages
 * (Category, Brand, Supplier, Customer, Product) call this hook instead
 * of duplicating the same fetch/CRUD wiring.
 */
export default function useResourceList(service, extraParams = {}) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const extraParamsKey = JSON.stringify(extraParams);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await service.list({ search, page, ...extraParams });
      setRows(data.data);
      setMeta(data.meta);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, extraParamsKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, [fetchRows]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const openAdd = () => {
    setEditingRow(null);
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setErrors({});
    setFormOpen(true);
  };

  const closeForm = () => setFormOpen(false);

  const submitForm = async (values) => {
    setSubmitting(true);
    setErrors({});
    try {
      if (editingRow) {
        await service.update(editingRow.id, values);
      } else {
        await service.create(values);
      }
      setFormOpen(false);
      fetchRows();
    } catch (err) {
      if (err.response?.status === 422 && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await service.remove(deleteTarget.id);
      setDeleteTarget(null);
      fetchRows();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return {
    rows,
    meta,
    loading,
    search,
    handleSearch,
    setPage,
    formOpen,
    editingRow,
    openAdd,
    openEdit,
    closeForm,
    submitForm,
    submitting,
    errors,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    deleting,
  };
}
