import React, { useEffect, useState } from "react";
import api from "@/utils/api";

const PAGE_SIZE = 20;

export default function SubscriptionData() {
  const [items, setItems] = useState([]);
  const [rawQ, setRawQ] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setQ(rawQ.trim()), 300);
    return () => clearTimeout(t);
  }, [rawQ]);

  const fetchSubs = async ({ page: pg = 1, q: query = "" } = {}) => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/subscriptions", {
        params: {
          page: pg,
          limit: PAGE_SIZE,
          q: query || undefined,
        },
      });
      setItems(res.data?.data || []);
      setPage(res.data?.pagination?.page || 1);
      setPages(res.data?.pagination?.pages || 1);
      setTotal(res.data?.pagination?.total || 0);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs({ page: 1, q });
  }, [q]);

  const prettyDate = (iso) => (iso ? new Date(iso).toLocaleString() : "-");

  const onDelete = async (id) => {
    const ok = window.confirm("Remove this subscription?");
    if (!ok) return;

    const prev = items;
    setItems((s) => s.filter((x) => x._id !== id));
    try {
      await api.delete(`/subscriptions/${id}`);
      if (items.length === 1 && page > 1) {
        await fetchSubs({ page: page - 1, q });
      } else {
        await fetchSubs({ page, q });
      }
    } catch (e) {
      setItems(prev);
      alert(e?.response?.data?.message || e?.message || "Failed to delete subscription.");
    }
  };

  const empty = !loading && items.length === 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold">Newsletter Subscribers</h1>
        <div className="flex gap-2 items-center">
          <input
            placeholder="Search email..."
            className="border rounded-md px-3 py-2 text-sm w-64"
            value={rawQ}
            onChange={(e) => setRawQ(e.target.value)}
          />
          <button
            onClick={() => fetchSubs({ page: 1, q })}
            className="border rounded-md px-3 py-2 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="text-sm text-neutral-600 mb-3">
        {loading ? "Loading..." : `Total: ${total}`}
      </div>

      {err && (
        <div className="mb-4 rounded-lg px-3 py-2 text-sm bg-red-50 text-red-700 border border-red-200">
          {err}
        </div>
      )}

      {empty ? (
        <div className="border rounded-lg p-8 text-center text-neutral-600">
          No subscriptions found.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50">
              <tr className="text-left">
                <Th>Email</Th>
                <Th>Created</Th>
                <Th className="text-right pr-3">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} className="border-t">
                  <Td>{row.email}</Td>
                  <Td>{prettyDate(row.createdAt)}</Td>
                  <Td className="text-right">
                    <button
                      onClick={() => onDelete(row._id)}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
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
            onClick={() => fetchSubs({ page: Math.max(1, page - 1), q })}
            disabled={page === 1 || loading}
          >
            Prev
          </button>
          <div className="text-sm">
            Page <strong>{page}</strong> of <strong>{pages}</strong>
          </div>
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            onClick={() => fetchSubs({ page: Math.min(pages, page + 1), q })}
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
