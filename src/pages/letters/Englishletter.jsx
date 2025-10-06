// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import HeadingDesc from "../../components/InnerComponents/HeadingDesc";
import Subcription from "../../components/InnerComponents/Subcription";
import LetterCard from "../../components/Cards/LetterCard";
import api from "../../utils/api"; // axios wrapper
import FilterDropdownCOD from "@/components/Letter/FilterDropdownCOD";

const BASE_URL = import.meta.env.VITE_FILE_BASE_URL;
const PAGE_SIZE = 12;

function LettersPage() {
  const { lang } = useParams();
  const [all, setAll] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadMoreBusy, setLoadMoreBusy] = useState(false);
  const [error, setError] = useState("");

  // filters
  const [categoryQ, setCategoryQ] = useState(""); // slug
  const [ownerQ, setOwnerQ] = useState(""); // fullName
  const [decadeQ, setDecadeQ] = useState(""); // decade

  const decadeOptions = [
    { value: "unknown", label: "Unknown" }, // akhri option
    { value: "before-1900", label: "Before 1900" }, // pehla option

    ...Array.from({ length: 10 }, (_, i) => {
      const start = 1900 + i * 10;
      const end = start + 10;
      return { value: `${start}-${end}`, label: `${start} - ${end}` };
    }),
  ];

  // ⬅️ naya effect add kiya: jab bhi lang change ho, page top se show kare
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" }); // ya behavior: "smooth"
  }, [lang]);

  // 🔹 fetch submissions
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    api
      .get("/submissions")
      .then((res) => {
        if (!alive) return;
        const data = res.data || [];
        const filtered = data
          .filter(
            (d) =>
              d.letterLanguage?.toLowerCase() === lang.toLowerCase() &&
              d.status?.toLowerCase() === "approved"
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAll(filtered);
      })
      .catch((e) => {
        if (!alive) return;
        console.error(e);
        setError("Failed to load letters. Check API/server.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [lang]);

  // 🔹 fetch categories
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

  // 🔹 unique owners (fullName)
  const owners = useMemo(() => {
    const names = Array.from(
      new Set(all.map((item) => item.fullName).filter(Boolean))
    );
    return names.sort();
  }, [all]);

  // 🟢 compute filtered + visible inline
  const filtered = all.filter((item) => {
    const matchC = categoryQ
      ? (item.letterCategory || "").toLowerCase() === categoryQ.toLowerCase()
      : true;
    const matchO = ownerQ
      ? (item.fullName || "").toLowerCase() === ownerQ.toLowerCase()
      : true;
    const matchD = decadeQ
      ? (item.decade || "").toLowerCase() === decadeQ.toLowerCase()
      : true;
    return matchC && matchO && matchD;
  });

  const visible = filtered.slice(0, visibleCount);



  const handleLoadMore = () => {
    setLoadMoreBusy(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadMoreBusy(false);
    }, 500);
  };

  const fileUrl = (pathLike) => {
    if (!pathLike) return "";
    if (/^https?:\/\//i.test(pathLike)) return pathLike;
    const cleaned = pathLike.replace(/^\/?/, "");
    return `${BASE_URL}/${cleaned}`;
  };


  const getFirstImageUrl = (item) => {
  // normalize: might be array (new) or single object (old docs)
  const pick0 = (v) => (Array.isArray(v) ? v[0] : v);

  const firstLetter = pick0(item.letterImage);
  const firstPhoto  = pick0(item.photoImage);

  const meta = firstLetter || firstPhoto; // prefer letter, fallback photo
  if (!meta) return "";

  // we stored S3 object key in `path`; multer-s3 also has `location` sometimes
  const raw = meta.path || meta.location || meta.url;
  return raw ? fileUrl(raw) : "";
};


  return (
    <div className=" bg-cover bg-center flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 mb-10 lg:mb-20 ">
      {/* Heading */}
      <HeadingDesc
        headingClassName="text-4xl md:text-[50px] text-center"
        heading={`${lang} Letters`}
        containerClassName="mt-6"
      />

      {/* Filters */}
      <div className="w-[90%] max-w-[1270px] mt-10 md:mt-16 flex flex-col md:flex-row justify-between items-end gap-5 lg:gap-5">
        {/* By Category */}
        <FilterDropdownCOD
          label="By Category"
          value={categoryQ}
          onChange={(e) => {
            setCategoryQ(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder="All categories"
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
        />

        {/* By Owner */}
        <FilterDropdownCOD
          label="By Owner's Name"
          value={ownerQ}
          onChange={(e) => {
            setOwnerQ(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder="All owners"
          options={owners.map((o) => ({ value: o, label: o }))}
        />

        {/* By Decade */}
        <FilterDropdownCOD
          label="By Decade"
          value={decadeQ}
          onChange={(e) => {
            setDecadeQ(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder="All decades"
          options={decadeOptions}
        />

        {/* Clear Filters Button */}
        <div className="flex items-end justify-end w-fit">
          <button
            onClick={() => {
              setCategoryQ("");
              setOwnerQ("");
              setDecadeQ("");
              setVisibleCount(PAGE_SIZE);
            }}
            className="px-4 whitespace-nowrap py-2 text-[#704214] font-semibold border border-[#704214] rounded-full hover:bg-[#704214] hover:text-white transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading / Error / Empty */}
      <div className="w-full max-w-6xl mt-10">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-t-[#704214] border-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 mt-8">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-[#704214] mt-8">
            No letters found for the selected filters.
          </p>
        ) : null}
      </div>

      {/* Cards */}
      {!loading && !error && filtered.length > 0 && (
        <div className="mt-8 w-full max-w-[1270px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {visible.map((item, i) => {
             const img = getFirstImageUrl(item);
            const title = item.fullName || "Untitled Letter";
            const category = item.letterCategory || "Untitled Letter";
            const desc =
              item.photoCaption ||
              item.letterNarrativeOptional ||
              `${item.letterCategory || "Unknown Category"} · ${
                item.decade || "Unknown Decade"
              }`;
            return (  
              <LetterCard 
                key={item._id || i}
                to={`/letters/${lang}/${item._id || i}`}
                overlay={img}
                title={title}
                letcategory={category}
                description={desc}
              />
            );
          })}
        </div>
      )}

      {/* Loader / Load More */}
      {!loading && !error && visible.length < filtered.length && (
        <div className="mt-12">
          {loadMoreBusy ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-t-[#704214] border-gray-300 rounded-full animate-spin"></div>
            </div>
          ) : (
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 text-[#704214] font-semibold border border-[#704214] rounded-full hover:bg-[#704214] hover:text-white transition disabled:opacity-50 cursor-pointer"
              disabled={loadMoreBusy}
            >
              Load More
            </button>
          )}
        </div>
      )}

      {/* Mailing List */}
      {/* <div className="my-20 w-full">
        <Subcription />
      </div> */}
    </div>
  );
}

export default LettersPage;
