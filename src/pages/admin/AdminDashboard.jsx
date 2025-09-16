// src/pages/admin/AdminDashboard.jsx
// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../../components/protected/ProtectedRoutes";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

// BACKEND FILE BASE (serve static /uploads from Express)
// Set in .env: VITE_FILE_BASE_URL=http://localhost:8000
const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || "http://localhost:8000";

// helper to build absolute file URLs
const buildFileUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;             // already absolute
  const key = p.replace(/^\/+/, "");                  // remove leading slash
  return `${FILE_BASE}/${key}`;
};

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // fetch submissions
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/submissions");
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onApprove = async (id) => {
    try {
      await api.patch(`/submissions/${id}/approve`);
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r)));
    } catch (e) {
      alert(e?.response?.data?.message || "Approve failed");
    }
  };

  const onReject = async (id) => {
    try {
      await api.patch(`/submissions/${id}/reject`);
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r)));
    } catch (e) {
      alert(e?.response?.data?.message || "Reject failed");
    }
  };

  const columns = useMemo(
    () => [
      { key: "fullName", label: "Name" },
      { key: "email", label: "Email" },
      { key: "uploadType", label: "Type" },
      { key: "title", label: "Title" },
      { key: "letterLanguage", label: "Language" },
      { key: "decade", label: "Decade" },
      { key: "before2000", label: "Before 2000" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Submitted" },
    ],
    []
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-8">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome{admin?.name ? `, ${admin.name}` : ""}
              </h1>
              <p className="text-gray-600">Email: {admin?.email || "—"}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {/* Errors / loading */}
          {err && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">{err}</div>
          )}
          {loading ? (
            <div className="p-6">Loading submissions…</div>
          ) : rows.length === 0 ? (
            <div className="p-6">No submissions found.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-full">
                <thead>
                  <tr className="">
                    {columns.map((c) => (
                      <th
                        key={c.key}
                        className="text-left text-sm font-semibold text-gray-700 px-4 py-3"
                      >
                        {c.label}
                      </th>
                    ))}
                    <th className="text-right text-sm font-semibold text-gray-700 px-4 py-3">
                      Files
                    </th>
                    <th className="text-right text-sm font-semibold text-gray-700 px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r._id} className="border-t">
                      <td className="px-4 py-3 text-sm">{r.fullName}</td>
                      <td className="px-4 py-3 text-sm">{r.email}</td>
                      <td className="px-4 py-3 text-sm">{r.uploadType}</td>
                      <td className="px-4 py-3 text-sm">{r.title}</td>
                      <td className="px-4 py-3 text-sm">{r.letterLanguage}</td>
                      <td className="px-4 py-3 text-sm">{r.decade}</td>
                      <td className="px-4 py-3 text-sm">{r.before2000}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            r.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : r.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {r.status || "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>

                      {/* Files */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {r.letterImage?.path && (
                            <a
                              href={buildFileUrl(r.letterImage.path)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                            >
                              Letter Img
                            </a>
                          )}
                          {r.photoImage?.path && (
                            <a
                              href={buildFileUrl(r.photoImage.path)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                            >
                              Photo Img
                            </a>
                          )}
                          {r.letterAudioFile?.path && (
                            <a
                              href={buildFileUrl(r.letterAudioFile.path)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                            >
                              Letter Audio
                            </a>
                          )}
                          {r.photoAudioFile?.path && (
                            <a
                              href={buildFileUrl(r.photoAudioFile.path)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                            >
                              Photo Audio
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onApprove(r._id)}
                            disabled={r.status === "approved"}
                            className={`px-3 py-1 rounded text-white text-sm ${
                              r.status === "approved"
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onReject(r._id)}
                            disabled={r.status === "rejected"}
                            className={`px-3 py-1 rounded text-white text-sm ${
                              r.status === "rejected"
                                ? "bg-red-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
