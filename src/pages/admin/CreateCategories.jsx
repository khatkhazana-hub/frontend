import React, { useEffect, useState } from "react";
import useCategories from "@/hooks/useCategories";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Edit3, Check, GripVertical } from "lucide-react";
import { useSnackbar } from "notistack";

export default function CreateCategories() {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [ordered, setOrdered] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [reordering, setReordering] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = useCategories({ auto: true });

  useEffect(() => {
    setOrdered(categories);
  }, [categories]);

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
      enqueueSnackbar(`Updated "${updated.name}"`, { variant: "success" });
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

  const handleDragStart = (event, id) => {
    if (reordering) return;
    // Avoid allowing drag while editing the active row
    if (editingId === id) {
      event.preventDefault();
      return;
    }
    setDraggingId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (event, overId) => {
    event.preventDefault();
    if (!draggingId || draggingId === overId) return;

    setOrdered((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((item) => item._id === draggingId);
      const toIndex = next.findIndex((item) => item._id === overId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });

    event.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = async (event) => {
    const dropEffect = event?.dataTransfer?.dropEffect;
    const validDrop = dropEffect && dropEffect !== "none";
    const nextIds = ordered.map((cat) => cat._id);
    const currentIds = categories.map((cat) => cat._id);

    setDraggingId(null);

    if (!validDrop) {
      setOrdered(categories);
      return;
    }

    const changed =
      nextIds.length !== currentIds.length ||
      nextIds.some((id, index) => id !== currentIds[index]);

    if (!changed) {
      setOrdered(categories);
      return;
    }

    try {
      setReordering(true);
      const updated = await reorderCategories(nextIds);
      setOrdered(updated);
      enqueueSnackbar("Category order updated", { variant: "success" });
    } catch (err) {
      setOrdered(categories);
      enqueueSnackbar(err.message || "Failed to reorder categories", { variant: "error" });
    } finally {
      setReordering(false);
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
            <Button
              type="submit"
              disabled={!name.trim() || loading || reordering}
              className="w-full md:w-auto"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </div>
        </form>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md p-2">{error}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="font-semibold">Existing</h4>
            {reordering && (
              <span className="inline-flex items-center text-xs text-primary gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving order...
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500">Drag rows to change the display order.</p>
          <div className="grid grid-cols-1 gap-2">
            {ordered.map((cat) => (
              <div
                key={cat._id}
                draggable={!reordering}
                onDragStart={(event) => handleDragStart(event, cat._id)}
                onDragOver={(event) => handleDragOver(event, cat._id)}
                onDragEnd={handleDragEnd}
                onDrop={(event) => event.preventDefault()}
                className={`flex items-center justify-between rounded-xl border p-3 hover:shadow-sm transition ${
                  draggingId === cat._id ? "opacity-60 ring-2 ring-primary/40 cursor-grabbing" : "cursor-grab"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical className="h-4 w-4 text-neutral-400 shrink-0" aria-hidden="true" />
                  {editingId === cat._id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-56"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium truncate">{cat.name}</span>
                  )}
                  <Badge variant={cat.active ? "default" : "secondary"}>
                    {cat.active ? "active" : "hidden"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {editingId === cat._id ? (
                    <Button size="sm" onClick={onSaveEdit} disabled={reordering}>
                      <Check className="h-4 w-4 mr-1" /> Save
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStartEdit(cat)}
                      disabled={reordering}
                    >
                      <Edit3 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleActive(cat)}
                    disabled={reordering}
                  >
                    {cat.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(cat._id)}
                    disabled={reordering}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
            {ordered.length === 0 && (
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
