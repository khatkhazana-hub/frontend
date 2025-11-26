import React, { useEffect, useMemo, useState } from "react";
import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2, Edit3, Check, UploadCloud } from "lucide-react";
import { useSnackbar } from "notistack";

export default function ProductsAdmin() {
  const { products, loading, error, refetch, createProduct, updateProduct, deleteProduct } =
    useProducts({ auto: true, includeInactive: true });
  const { activeOptions: categories } = useCategories({ auto: true });
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    tag: "",
    rating: 4.8,
    reviews: 0,
    inStock: true,
    featured: false,
    active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      category: "",
      image: "",
      tag: "",
      rating: 4.8,
      reviews: 0,
      inStock: true,
      featured: false,
      active: true,
    });
    setEditingId(null);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const token = localStorage.getItem("adminToken");
      const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
      const endpoint = apiBase.endsWith("/api") ? apiBase : `${apiBase}/api`;
      const res = await fetch(`${endpoint}/products/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token.replace(/^"|"$/g, "")}` : "",
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm((p) => ({ ...p, image: data.url }));
      enqueueSnackbar("Image uploaded", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message || "Upload failed", { variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        price: Number(form.price || 0),
        rating: Number(form.rating || 0),
        reviews: Number(form.reviews || 0),
      };
      if (!payload.title || !payload.description || !payload.price || !payload.category || !payload.image) {
        enqueueSnackbar("Title, description, price, category, and image are required.", {
          variant: "warning",
        });
        setSaving(false);
        return;
      }
      if (editingId) {
        await updateProduct(editingId, payload);
        enqueueSnackbar("Product updated", { variant: "success" });
      } else {
        await createProduct(payload);
        enqueueSnackbar("Product created", { variant: "success" });
      }
      resetForm();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message || "Save failed", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      image: product.image || "",
      tag: product.tag || "",
      rating: product.rating ?? 0,
      reviews: product.reviews ?? 0,
      inStock: product.inStock ?? true,
      featured: product.featured ?? false,
      active: product.active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    try {
      await deleteProduct(id);
      enqueueSnackbar("Product deleted", { variant: "warning" });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message || "Delete failed", { variant: "error" });
    }
  };

  const sorted = useMemo(
    () => [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [products]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Card className="max-w-5xl mx-auto shadow-lg border border-neutral-200">
      <CardHeader>
        <CardTitle className="text-xl">{editingId ? "Edit product" : "Create product"}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Scripted Letters Kit"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                list="category-options"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                placeholder="Stationery"
              />
              <datalist id="category-options">
                {categories.map((c) => (
                  <option key={c._id} value={c.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="24"
              />
            </div>
            <div>
              <Label htmlFor="image">Image upload</Label>
              <div className="flex gap-2">
                <label className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium text-[#6E4A27] hover:bg-amber-50 cursor-pointer">
                  <UploadCloud className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files?.[0])}
                  />
                </label>
                {form.image ? (
                  <span className="text-xs text-neutral-700 truncate max-w-[200px]">
                    {form.image}
                  </span>
                ) : (
                  <span className="text-xs text-neutral-500">No file uploaded yet</span>
                )}
              </div>
              {uploading && (
                <p className="text-xs text-neutral-600 flex items-center gap-1 mt-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full rounded-md border px-3 py-2 text-sm"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label htmlFor="tag">Tag (optional)</Label>
              <Input
                id="tag"
                value={form.tag}
                onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
                placeholder="New drop"
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="reviews">Reviews</Label>
              <Input
                id="reviews"
                type="number"
                min="0"
                value={form.reviews}
                onChange={(e) => setForm((p) => ({ ...p, reviews: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <Switch
                id="instock"
                checked={form.inStock}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, inStock: checked }))}
              />
              <Label htmlFor="instock">In stock</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, featured: checked }))}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, active: checked }))}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? "Update" : "Create"}
            </Button>
            {editingId ? (
              <Button variant="outline" type="button" onClick={resetForm}>
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-2">{error}</p>}
      </CardContent>

      <CardFooter className="border-t border-neutral-200 bg-neutral-50">
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Products</h4>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />}
          </div>
          <div className="grid gap-2">
            {sorted.map((product) => (
              <div
                key={product._id}
                className="flex flex-col gap-2 rounded-xl border p-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-12 w-12 rounded-md object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{product.title}</p>
                    <p className="text-xs text-neutral-600 truncate">
                      {product.category} · ${product.price}
                    </p>
                    <div className="flex gap-2 text-xs text-neutral-600">
                      {product.featured ? <Badge>Featured</Badge> : null}
                      <Badge variant={product.active ? "default" : "secondary"}>
                        {product.active ? "active" : "hidden"}
                      </Badge>
                      <Badge variant={product.inStock ? "default" : "secondary"}>
                        {product.inStock ? "in stock" : "out"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
                    <Edit3 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(product._id)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
            {!sorted.length && !loading && (
              <p className="text-sm text-neutral-500">No products yet.</p>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
