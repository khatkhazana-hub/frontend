// src/hooks/useCategories.js
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/utils/api";

export default function useCategories({ auto = true } = {}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const sortCategories = useCallback((items) => {
    if (!Array.isArray(items)) return [];
    return [...items].sort((a, b) => {
      const orderA = typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER;
      const orderB = typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER;
      if (orderA === orderB) {
        return (a.name || "").localeCompare(b.name || "");
      }
      return orderA - orderB;
    });
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/categories");
      setCategories(sortCategories(data));
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [sortCategories]);

  const createCategory = useCallback(
    async (name) => {
      if (!name || !name.trim()) throw new Error("Name is required");
      const { data } = await api.post("/categories", { name: name.trim() });
      setCategories((prev) => {
        const exists = prev.some((c) => c._id === data._id || c.slug === data.slug);
        return exists ? prev : sortCategories([...prev, data]);
      });
      return data;
    },
    [sortCategories]
  );

  const updateCategory = useCallback(async (id, payload) => {
    const { data } = await api.put(`/categories/${id}`, payload);
    setCategories((prev) => sortCategories(prev.map((c) => (c._id === id ? data : c))));
    return data;
  }, [sortCategories]);

  const deleteCategory = useCallback(async (id) => {
    await api.delete(`/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  }, []);

  const reorderCategories = useCallback(async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("ids array is required");
    }
    const { data } = await api.put("/categories/reorder", { ids });
    const next = sortCategories(data);
    setCategories(next);
    return next;
  }, [sortCategories]);

  useEffect(() => {
    if (auto) fetchCategories();
  }, [auto, fetchCategories]);

  const activeOptions = useMemo(() => categories.filter((c) => c.active !== false), [categories]);

  return {
    categories,
    activeOptions,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  };
}
