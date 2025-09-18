// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import HeadingDesc from "../../components/InnerComponents/HeadingDesc";
import Subcription from "../../components/InnerComponents/Subcription";
import LetterCard from "../../components/Cards/LetterCard";
import api from "../../utils/api"; // 👈 use axios wrapper

const BASE_URL = import.meta.env.VITE_FILE_BASE_URL;
const PAGE_SIZE = 12;

function LettersPage() {
  const { lang } = useParams();
  const [all, setAll] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadMoreBusy, setLoadMoreBusy] = useState(false);
  const [error, setError] = useState("");

  // filters
  const [categoryQ, setCategoryQ] = useState("");
  const [ownerQ, setOwnerQ] = useState("");
  const [decadeQ, setDecadeQ] = useState("");

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

  // 🟢 compute filtered + visible inline
  const c = categoryQ.trim().toLowerCase();
  const o = ownerQ.trim().toLowerCase();
  const d = decadeQ.trim().toLowerCase();

  const filtered = all.filter((item) => {
    const cat = (item.letterCategory || "").toLowerCase();
    const owner = (item.fullName || "").toLowerCase();
    const decade = (item.decade || "").toLowerCase();

    const matchC = c ? cat.includes(c) : true;
    const matchO = o ? owner.includes(o) : true;
    const matchD = d ? decade.includes(d) : true;
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

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <HeadingDesc
        headingClassName="md:text-[40px] text-center"
        heading={`${lang} Letters`}
        containerClassName="mt-6"
        description={`Browse only approved submissions in ${lang}.`}
      />

      {/* Filters */}
      <div className="w-[90%] md:w-full max-w-5xl mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="flex flex-col w-full text-left">
          <span className="text-lg font-semibold text-[#704214] hover:text-black mb-2">
            By Category
          </span>
          <div className="flex items-center w-full border-2 border-[#704214] rounded-full px-4 py-2 bg-white/20 backdrop-blur-sm">
            <FiSearch className="text-[#704214] mr-2" size={20} />
            <input
              type="text"
              value={categoryQ}
              onChange={(e) => {
                setCategoryQ(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search category..."
              className="w-full outline-none bg-transparent placeholder:text-[#704214] text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col w-full text-left">
          <span className="text-lg font-semibold text-[#704214] hover:text-black mb-2">
            By Owner's Name
          </span>
          <div className="flex items-center w-full border-2 border-[#704214] rounded-full px-4 py-2 bg-white/20 backdrop-blur-sm">
            <FiSearch className="text-[#704214] mr-2" size={20} />
            <input
              type="text"
              value={ownerQ}
              onChange={(e) => {
                setOwnerQ(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search owner's name..."
              className="w-full outline-none bg-transparent placeholder:text-[#704214] text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col w-full text-left">
          <span className="text-lg font-semibold text-[#704214] hover:text-black mb-2">
            By Decade
          </span>
          <div className="flex items-center w-full border-2 border-[#704214] rounded-full px-4 py-2 bg-white/20 backdrop-blur-sm">
            <FiSearch className="text-[#704214] mr-2" size={20} />
            <input
              type="text"
              value={decadeQ}
              onChange={(e) => {
                setDecadeQ(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search decade (e.g. 1900-1910)..."
              className="w-full outline-none bg-transparent placeholder:text-[#704214] text-sm"
            />
          </div>
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
            No approved {lang} letters match your filters.
          </p>
        ) : null}
      </div>

      {/* Cards */}
      {!loading && !error && filtered.length > 0 && (
        <div className="mt-8 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {visible.map((item, i) => {
            const img =
              (item.letterImage && fileUrl(item.letterImage.path)) ||
              "/images/About-1.webp";
            const title = item.title || "Untitled Letter";
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
      <div className="my-20 w-full">
        <Subcription />
      </div>
    </div>
  );
}

export default LettersPage;
