import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import ThumbnailCards from "../../components/InnerComponents/ThumbnailCards";
import RelatedPhotographs from "../../components/Cards/RelatedPhotographs";

const PhotoGraphDetail = () => {
  // const { id } = useParams();
  // // const navigate = useNavigate();

  // const photo = cards?.find((c) => c.id === Number(id));

  // if (!photo) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //       <h1 className="text-2xl font-semibold text-red-500">
  //         ❌ Photo not found
  //       </h1>
  //     </div>
  //   );
  // }

  return (
    <>
      {/* ✅ Base background wrapper */}
      <div className="min-h-[300px] px-5 lg:px-0 bg-cover bg-center">
        <div className="py-5  max-w-[1270px]  w-full mx-auto text-black">
          {/* Date + Category */}
          <div className="flex items-center text-sm  mt-10">
            <div className="inline-flex items-center justify-evenly bg-white text-black px-4 py-2 rounded-full shadow-sm space-x-2">
              <IoCalendarOutline className="w-4 h-4 mr-2" />
              <span className="text-sm" style={{ fontFamily: "philosopher" }}>
                08 Jan, 2025
              </span>

              <span className="w-px h-4 bg-black ml-1" />
              <span className="text-sm">War Political</span>
            </div>
          </div>
          {/* Title */}.
          <p
            className="w-full text-left text-2xl md:text-[40px] font-bold capitalize "
            style={{ fontFamily: "philosopher" }}
          >
            Want More Lorem Ipsum Letters?
          </p>
        </div>

        {/* ✅ Second background wrapper */}
        <div
          className=" w-full max-w-[1270px] rounded-[16px] 
             py-10 px-5 lg:py-16 lg:px-8 flex flex-col gap-10 
             bg-cover bg-center mx-auto "
          style={{ backgroundImage: "url('/images/Card.webp')" }}
        >
          <div className="w-full text-black">
            <div className="flex flex-col lg:flex-row justify-start gap-5 mb-6 w-full">
              <img
                src="/images/About-1.webp"
                alt="Lorem Ipsum"
                className=" rounded-[20px] mx-auto w-[70%] h-[300px] lg:h-[500px] max-h-[500px] object-contain "
              />
              <div className="self-center w-full h-px border-t border-black lg:w-px lg:h-[400px] lg:border-t-0 lg:border-l"></div>

              <ThumbnailCards />
            </div>

            {/* Paragraph + Right Cards */}
            <div className="mt-10 flex flex-col lg:flex-row justify-between  gap-10">
              <div
                className="lg:w-[70%] xl:w-[80%]  w-full text-[18px] sm:text-[20px] md:text-[26px] lg:text-[30px] 
                   text-black leading-7 sm:leading-8 md:leading-10 italic text-left "
                style={{ fontFamily: "'Ephesis'" }}
              >
                Reduced documents processing time by 60% & improved
                collaboration efficiency, Reduced documents processing time by
                60% & improved collaboration efficiency, Reduced documents
                processing time.
                <br />
                Reduced documents processing time by 60% & improved
                collaboration efficiency, Reduced documents processing time by
                60% & improved collaboration efficiency, Reduced documents
                processing time by 60% & improved collaboration
                efficiency,Reduced documents processing time by 60% & improved.
                <br />
                Reduced documents processing time by 60% & improved
                collaboration efficiency, Reduced documents processing time by
                60% & improved collaboration efficiency, Reduced documents
                processing time by 60% & improved collaboration
                efficiency,Reduced documents processing time by 60% & improved.
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Related Letters Section */}
        <div className=" w-full lg:py-20 py-10">
          <RelatedPhotographs />
        </div>
      </div>
    </>
  );
};

export default PhotoGraphDetail;
