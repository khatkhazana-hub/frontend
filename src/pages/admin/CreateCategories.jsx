import React, { useState } from "react";
import useCategories from "@/hooks/useCategories";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Edit3, Check } from "lucide-react";
import { useSnackbar } from "notistack";

export default function CreateCategories() {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories({ auto: true });

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await createCategory(name);
      enqueueSnackbar(`Category "${created.name}" created`, { variant: "success" });
      setName("");
    } catch (err) {
      enqueueSnackbar(err.message || "Create failed", { variant: "error" });
    }
  };

  const onStartEdit = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
  };

  const onSaveEdit = async () => {
    try {
      const updated = await updateCategory(editingId, { name: editingName });
      enqueueSnackbar(`Updated → ${updated.name}`, { variant: "success" });
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      enqueueSnackbar(err.message || "Update failed", { variant: "error" });
    }
  };

  const onToggleActive = async (cat) => {
    try {
      const updated = await updateCategory(cat._id, { active: !cat.active });
      enqueueSnackbar(
        `${updated.name} ${updated.active ? "activated" : "hidden"}`,
        { variant: "info" }
      );
    } catch (err) {
      enqueueSnackbar(err.message || "Toggle failed", { variant: "error" });
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteCategory(id);
      enqueueSnackbar("Category deleted", { variant: "warning" });
    } catch (err) {
      enqueueSnackbar(err.message || "Delete failed", { variant: "error" });
    }
  };
  

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border border-neutral-200">
      <CardHeader>
        <CardTitle className="text-xl">Categories</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <div>
            <Label htmlFor="name">Create new</Label>
            <Input
              id="name"
              placeholder="e.g. Family"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={!name.trim() || loading} className="w-full md:w-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </div>
        </form>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md p-2">{error}</p>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold">Existing</h4>
          <div className="grid grid-cols-1 gap-2">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center justify-between rounded-xl border p-3 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-2">
                  {editingId === cat._id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-56"
                    />
                  ) : (
                    <span className="font-medium">{cat.name}</span>
                  )}
                  <Badge variant={cat.active ? "default" : "secondary"}>
                    {cat.active ? "active" : "hidden"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {editingId === cat._id ? (
                    <Button size="sm" onClick={onSaveEdit}>
                      <Check className="h-4 w-4 mr-1" /> Save
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => onStartEdit(cat)}>
                      <Edit3 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => onToggleActive(cat)}>
                    {cat.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(cat._id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-neutral-500">No categories yet.</p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="text-xs text-neutral-500">
        Changes reflect instantly in your dropdowns.
      </CardFooter>
    </Card>
  );
}
