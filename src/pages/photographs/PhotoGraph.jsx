/* eslint-disable no-unused-vars */
// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import HeadingDesc from "../../components/InnerComponents/HeadingDesc";
import PhotographCard from "../../components/Cards/PhotographCard";
import Subcription from "../../components/InnerComponents/Subcription";
import FilterDropdownCOD from "@/components/Letter/FilterDropdownCOD";
import api from "@/utils/api";
import useSubmissions from "@/hooks/useSubmissions";

const BASE_URL = import.meta.env.VITE_FILE_BASE_URL || window.location.origin;

const fileUrl = (pathLike) => {
  if (!pathLike) return "";
  if (/^https?:\/\//i.test(pathLike)) return pathLike;
  const cleaned = String(pathLike).replace(/^\/+/, "");
  return `${BASE_URL}/${cleaned}`;
};

// grab first meta whether it's array or single object
const firstMeta = (v) => (Array.isArray(v) ? v[0] : v) || null;

const getPhotoUrl = (row) => {
  const meta = firstMeta(row?.photoImage);
  const raw = meta?.path || meta?.location || meta?.url;
  return raw ? fileUrl(raw) : "";
};

export default function PhotoGraph() {
  const { rows, loading: loadingRows, err } = useSubmissions({
    serverFilter: false,
  });

  const PAGE = 12;
  const decadeOptions = useMemo(
    () => [
      { value: "unknown", label: "Unknown" },
      { value: "before-1900", label: "Before 1900" },
      ...Array.from({ length: 10 }, (_, i) => {
        const start = 1900 + i * 10;
        const end = start + 10;
        return { value: `${start}-${end}`, label: `${start} - ${end}` };
      }),
      { value: "2000-2010", label: "2000 - 2010" },
      { value: "2010-2020", label: "2010 - 2020" },
      { value: "2020-present", label: "2020 - Present" },
    ],
    []
  );

  const [categories, setCategories] = useState([]);
  const [categoryQ, setCategoryQ] = useState("");
  const [ownerQ, setOwnerQ] = useState("");
  const [decadeQ, setDecadeQ] = useState("");
  const photos = useMemo(() => {
    const okTypes = new Set(["photographs", "both"]);
    return (rows || [])
      .filter((r) => {
        const type = String(r?.uploadType || "").toLowerCase();
        const isAllowedType = okTypes.has(type);
        const isApproved =
          type === "both"
            ? String(r?.photoStatus || r?.status || "")
                .toLowerCase() === "approved"
            : String(r?.status || "").toLowerCase() === "approved";

        const meta = firstMeta(r?.photoImage);
        const hasImage = !!(meta && (meta.path || meta.location || meta.url));

        return isAllowedType && isApproved && hasImage;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [rows]);

  const owners = useMemo(() => {
    const names = Array.from(
      new Set(photos.map((item) => item.fullName).filter(Boolean))
    );
    return names.sort();
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    const norm = (v) => String(v || "").toLowerCase();
    return photos.filter((item) => {
      const categoryVal =
        item.photoCategory || item.letterCategory || item.category || "";
      const matchC = categoryQ ? norm(categoryVal) === norm(categoryQ) : true;
      const matchO = ownerQ ? norm(item.fullName) === norm(ownerQ) : true;
      const matchD = decadeQ ? norm(item.decade) === norm(decadeQ) : true;
      return matchC && matchO && matchD;
    });
  }, [photos, categoryQ, ownerQ, decadeQ]);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        const data = res.data || [];
        const active = data.filter((c) => c.active);
        setCategories(active);
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
        setCategories([]);
      });
  }, []);

  const [visibleCount, setVisibleCount] = useState(PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const visibleRows = filteredPhotos.slice(0, visibleCount);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((p) => p + PAGE);
      setLoadingMore(false);
    }, 650);
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <HeadingDesc
        headingClassName="text-4xl md:text-[50px] text-center"
        heading="Photographs"
        containerClassName="mt-6"
      />

      <div className="w-[90%] max-w-[1270px] mt-10 md:mt-16 flex flex-col md:flex-row justify-between items-end gap-5 lg:gap-5">
        <FilterDropdownCOD
          label="By Category"
          value={categoryQ}
          onChange={(e) => {
            setCategoryQ(e.target.value);
            setVisibleCount(PAGE);
          }}
          placeholder="All categories"
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
        />

        <FilterDropdownCOD
          label="By Owner's Name"
          value={ownerQ}
          onChange={(e) => {
            setOwnerQ(e.target.value);
            setVisibleCount(PAGE);
          }}
          placeholder="All owners"
          options={owners.map((o) => ({ value: o, label: o }))}
        />

        <FilterDropdownCOD
          label="By Decade"
          value={decadeQ}
          onChange={(e) => {
            setDecadeQ(e.target.value);
            setVisibleCount(PAGE);
          }}
          placeholder="All decades"
          options={decadeOptions}
        />

        <div className="flex items-end justify-end w-fit">
          <button
            onClick={() => {
              setCategoryQ("");
              setOwnerQ("");
              setDecadeQ("");
              setVisibleCount(PAGE);
            }}
            className="px-4 whitespace-nowrap py-2 text-[#704214] font-semibold border border-[#704214] rounded-full hover:bg-[#704214] hover:text-white transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {err && <div className="mt-10 text-red-600 text-sm">{err}</div>}

      {loadingRows && !photos.length ? (
        <div className="mt-16 w-full max-w-[1270px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-200/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-16 w-full max-w-[1270px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {visibleRows.map((r) => (
              <PhotographCard
                key={r._id}
                to={`/photographs/${r._id}`}
                overlayImg={getPhotoUrl(r)} // first photo image
                title={r.photoCaption || r.fullName || "Untitled"}
                description={
                  r.photoNarrative ||
                  r.photoNarrativeOptional ||
                  r.photoPlace ||
                  "Unknown place"
                }
              />
            ))}
          </div>

          {!loadingRows && photos.length === 0 && (
            <div className="mt-16 text-center text-sm text-gray-600">
              No approved photographs yet.
            </div>
          )}

          {!loadingRows && photos.length > 0 && filteredPhotos.length === 0 && (
            <div className="mt-16 text-center text-sm text-gray-600">
              No photographs found for the selected filters.
            </div>
          )}

          <div className="mt-20">
            {loadingMore ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-t-[#704214] border-gray-300 rounded-full animate-spin"></div>
              </div>
            ) : (
              visibleCount < filteredPhotos.length && (
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 text-[#704214] font-semibold border border-[#704214] rounded-full hover:bg-[#704214] hover:text-white transition disabled:opacity-50 cursor-pointer"
                  disabled={loadingMore}
                >
                  Load More
                </button>
              )
            )}
          </div>
        </>
      )}

      {/* <div className="my-20 w-full">
        <Subcription />
      </div> */}
    </div>
  );
}
