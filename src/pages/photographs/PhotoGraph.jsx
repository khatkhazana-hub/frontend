/* eslint-disable no-unused-vars */
// @ts-nocheck
import React, { useMemo, useState } from "react";
import HeadingDesc from "../../components/InnerComponents/HeadingDesc";
import PhotographCard from "../../components/Cards/PhotographCard";
import Subcription from "../../components/InnerComponents/Subcription";
import useSubmissions from "@/hooks/useSubmissions";

const BASE_URL = import.meta.env.VITE_FILE_BASE_URL || window.location.origin;
const fileUrl = (pathLike) => {
  if (!pathLike) return "";
  if (/^https?:\/\//i.test(pathLike)) return pathLike;
  const cleaned = String(pathLike).replace(/^\/+/, ""); // keep "public/..."
  return `${BASE_URL}/${cleaned}`;
};

export default function PhotoGraph() {
  // pull everything; we'll filter client-side to avoid array-deps loops
  const { rows, loading: loadingRows, err } = useSubmissions({
    serverFilter: false,
  });

  const photos = useMemo(() => {
    const okTypes = new Set(["photographs", "both"]);
    return (rows || [])
      .filter((r) => {
        const type = String(r?.uploadType || "").toLowerCase();
        const isAllowedType = okTypes.has(type);
        const hasImage = !!r?.photoImage?.path;            // always use photo image for the card
        const isApproved = String(r?.status || "").toLowerCase() === "approved";
        return isAllowedType && hasImage && isApproved;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
  }, [rows]);

  const PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const visibleRows = photos.slice(0, visibleCount);

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

      {err && <div className="mt-10 text-red-600 text-sm">{err}</div>}

      {(loadingRows && !photos.length) ? (
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
                overlayImg={fileUrl(r.photoImage.path)}   // always the photo image
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

          <div className="mt-20">
            {loadingMore ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-t-[#704214] border-gray-300 rounded-full animate-spin"></div>
              </div>
            ) : (
              visibleCount < photos.length && (
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
