import React, { useEffect, useState } from "react";
import api from "@/utils/api";

const PAGE_SIZE = 10;

export default function ContactData() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [rawQ, setRawQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setQ(rawQ.trim()), 300);
    return () => clearTimeout(t);
  }, [rawQ]);

  const fetchContacts = async ({ page: pg = 1, q: query = "" } = {}) => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/contacts", {
        params: { page: pg, limit: PAGE_SIZE, q: query || undefined },
      });
      setItems(res.data?.data || []);
      setPage(res.data?.pagination?.page || 1);
      setPages(res.data?.pagination?.pages || 1);
      setTotal(res.data?.pagination?.total || 0);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts({ page: 1, q });
  }, [q]);

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this contact? This cannot be undone.");
    if (!ok) return;

    const prev = items;
    setItems((s) => s.filter((x) => x._id !== id));
    try {
      await api.delete(`/contacts/${id}`);
      if (items.length === 1 && page > 1) {
        await fetchContacts({ page: page - 1, q });
      } else {
        await fetchContacts({ page, q });
      }
    } catch (e) {
      setItems(prev);
      alert(e?.response?.data?.message || e?.message || "Delete failed. Try again.");
    }
  };

  const prettyDate = (iso) => (iso ? new Date(iso).toLocaleString() : "-");
  const empty = !loading && items.length === 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <div className="flex gap-2 items-center">
          <input
            placeholder="Search name, email, message…"
            className="border rounded-md px-3 py-2 text-sm w-72"
            value={rawQ}
            onChange={(e) => setRawQ(e.target.value)}
          />
          <button
            onClick={() => fetchContacts({ page: 1, q })}
            className="border rounded-md px-3 py-2 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="text-sm text-neutral-600 mb-3">
        {loading ? "Loading…" : `Total: ${total}`}
      </div>

      {err && (
        <div className="mb-4 rounded-lg px-3 py-2 text-sm bg-red-50 text-red-700 border border-red-200">
          {err}
        </div>
      )}

      {empty ? (
        <div className="border rounded-lg p-8 text-center text-neutral-600">
          No contacts found.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50">
              <tr className="text-left">
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>City</Th>
                <Th>Message</Th>
                <Th>Subscribed</Th>
                <Th>Created</Th>
                <Th className="text-right pr-3">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} className="border-t">
                  <Td>{row.name || "-"}</Td>
                  <Td>{row.email || "-"}</Td>
                  <Td>{row.phone || "-"}</Td>
                  <Td>
                    {[row.city, row.state, row.country].filter(Boolean).join(", ") || "-"}
                  </Td>
                  <Td className="max-w-xs whitespace-pre-line">
                    {row.message || ""}
                  </Td>
                  <Td>{row.subscribe ? "Yes" : "No"}</Td>
                  <Td>{prettyDate(row.createdAt)}</Td>
                  <Td className="text-right">
                    <button
                      onClick={() => onDelete(row._id)}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            onClick={() => fetchContacts({ page: Math.max(1, page - 1), q })}
            disabled={page === 1 || loading}
          >
            Prev
          </button>
          <div className="text-sm">
            Page <strong>{page}</strong> of <strong>{pages}</strong>
          </div>
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            onClick={() => fetchContacts({ page: Math.min(pages, page + 1), q })}
            disabled={page === pages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function Th({ children, className }) {
  return (
    <th className={`px-3 py-2 font-semibold text-neutral-700 ${className || ""}`}>
      {children}
    </th>
  );
}
function Td({ children, className }) {
  return <td className={`px-3 py-2 align-top ${className || ""}`}>{children}</td>;
}
