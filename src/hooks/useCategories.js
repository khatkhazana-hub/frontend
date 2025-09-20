// src/hooks/useCategories.js
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/utils/api";

export default function useCategories({ auto = true } = {}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/categories");
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (name) => {
      if (!name || !name.trim()) throw new Error("Name is required");
      const { data } = await api.post("/categories", { name: name.trim() });
      setCategories((prev) => {
        const exists = prev.some((c) => c._id === data._id || c.slug === data.slug);
        return exists ? prev : [...prev, data].sort((a, b) => a.name.localeCompare(b.name));
      });
      return data;
    },
    []
  );

  const updateCategory = useCallback(async (id, payload) => {
    const { data } = await api.put(`/categories/${id}`, payload);
    setCategories((prev) => prev.map((c) => (c._id === id ? data : c)));
    return data;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await api.delete(`/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  }, []);

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
  };
}
