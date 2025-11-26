import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/utils/api";

export default function useProducts({ auto = true, includeInactive = false } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);
        const query = { ...params };
        if (!includeInactive) query.active = true;
        const { data } = await api.get("/products", { params: query });
        setProducts(data || []);
        return data;
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [includeInactive]
  );

  const createProduct = useCallback(async (payload) => {
    const { data } = await api.post("/products", payload);
    setProducts((prev) => [data, ...prev]);
    return data;
  }, []);

  const updateProduct = useCallback(async (id, payload) => {
    const { data } = await api.put(`/products/${id}`, payload);
    setProducts((prev) => prev.map((p) => (p._id === id ? data : p)));
    return data;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }, []);

  useEffect(() => {
    if (auto) fetchProducts();
  }, [auto, fetchProducts]);

  const activeProducts = useMemo(
    () => (includeInactive ? products : products.filter((p) => p.active !== false)),
    [products, includeInactive]
  );

  return {
    products: activeProducts,
    rawProducts: products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
