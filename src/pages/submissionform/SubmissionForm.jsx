// @ts-nocheck
import React, { useState } from "react";
import ParchmentButton from "../../components/InnerComponents/ParchmentButton";
import Form from "../../components/SubmissionForm/Form";

// ✅ Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  px-5 lg:px-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#F7DBB9] rounded-lg max-w-2xl w-full p-8 relative ">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute text-xl top-4 right-6 cursor-pointer  text-[#4A2C2A] hover:text-black"
        >
          ✕
        </button>
        {/* Title */}
        <h2
          className="text-2xl font-bold text-[#4A2C2A] mb-4 text-center capitalize"
          style={{ fontFamily: "Philosopher, serif" }}
        >
          {title}
        </h2>
        <div className="text-[#5C4033] leading-relaxed sentence overflow-auto max-h-[80%] ">
          {children}
        </div>
      </div>
    </div>
  );
};

// ✅ Main Component
const SubmissionForm = () => {
  const [modalData, setModalData] = useState({ open: false, type: null });

  const openModal = (type) => setModalData({ open: true, type });
  const closeModal = () => setModalData({ open: false, type: null });

  return (
    <main className="container mx-auto px-5 lg:px-8 py-20 ">
      <div className="flex flex-col justify-center items-center gap-10 text-center">
        <h1 className="text-3xl md:text-[50px] font-['Philosopher',_serif] font-bold text-black">
          How To Submit Your Letter
        </h1>
        <div className=" flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
          <ParchmentButton onClick={() => openModal("terms")}>
            Terms of Submission
          </ParchmentButton>

          <ParchmentButton onClick={() => openModal("guidelines")}>
            Submission Guidelines
          </ParchmentButton>

          <ParchmentButton onClick={() => openModal("notice")}>
            ⚠️ Important Notice
          </ParchmentButton>
        </div>
      </div>

      <div className=" my-10 md:my-20">
        <Form>
          <input type="text" placeholder="Your Name" />
          <textarea placeholder="Your Message"></textarea>
          <button type="submit">Submit</button>
        </Form>
      </div>

      {/* Modal Content */}
      <Modal
        isOpen={modalData.open}
        onClose={closeModal}
        title={
          modalData.type === "terms"
            ? "Terms Of Submission"
            : modalData.type === "guidelines"
            ? "Submission Guidelines"
            : ""
        }
      >
        {modalData.type === "terms" && (
          <div className="text-[#5C4033] leading-relaxed space-y-4 text-left overflow-auto sentence max-h-[60vh] ">
            <p>
              These Terms of Submission (“Terms”) govern the content that you
              (“Contributor,” “You,” or “Your”) submit to longlostletters.com
              (“We,” “Us,” or “Our”). By submitting content, You agree to the
              following:
            </p>

            <p>
              <strong>1. Eligibility:</strong> You affirm that you are at least
              18 years of age (or have the consent of a parent/guardian if under
              18) and that you have full legal capacity to enter into this
              agreement.
            </p>

            <p>
              <strong>2. Ownership and Rights:</strong> You agree and warrant
              that you are the owner of the handwritten letter(s),
              photograph(s), audio file(s), transcript(s), description(s), or
              any other material you submit (collectively, “content”). You
              further warrant that your submission does not infringe upon the
              rights of any third party, including intellectual property,
              privacy, or publicity rights. By submitting content, you grant
              longlostletters.com a non-exclusive, royalty-free, worldwide,
              perpetual license to reproduce, publish, display, distribute,
              archive, and otherwise use the content on any platform, including
              but not limited to our website, social media channels, and print
              materials. You retain ownership of your content but authorize us
              to use it as described above without the need for additional
              consent or compensation.
            </p>

            <p>
              <strong>3. Right to Reject Submissions:</strong> We reserve the
              right to reject, remove, or decline to publish any submission for
              any reason whatsoever, at our sole discretion. By submitting
              content, you expressly agree that you have no right to challenge,
              dispute, or contest our decision to accept or reject your
              submission.
            </p>

            <p>
              <strong>4. Limitation of Liability:</strong> Once content is
              published on our platform(s), we cannot control or prevent third
              parties from copying, downloading, misusing, or distributing it
              elsewhere. By submitting content, you agree that
              longlostletters.com, its affiliates, and representatives cannot be
              held responsible or liable for any unauthorized use, reproduction,
              or distribution of your content by third parties.
            </p>

            <p>
              <strong>5. Prohibited Content:</strong> You may not submit content
              that includes or promotes: material directed against any religion,
              sect, political party, organization, or individual. Nudity,
              vulgarity, obscenity, or offensive material. Any unlawful,
              defamatory, harassing, discriminatory, or otherwise inappropriate
              material. Submissions violating these standards may be removed at
              our sole discretion without notice.
            </p>

            <p>
              <strong>6. Editorial Rights:</strong> We reserve the right, at our
              sole discretion, to review, format, reject, or remove any
              submission, in whole or in part, at any time.
            </p>

            <p>
              <strong>No Compensation:</strong> Unless explicitly agreed in
              writing: you will not be entitled to any financial or other
              compensation for your submissions.
            </p>

            <p>
              <strong>7. Privacy and Personal Information:</strong> Do not
              include personal, sensitive, or confidential information (such as
              phone numbers, or financial data) in your submissions. You
              understand that any personal information voluntarily included in
              your content is shared publicly at your own risk.
            </p>

            <p>
              <strong>8. Indemnification:</strong> You agree to indemnify,
              defend, and hold harmless longlostletters.com, its owners,
              affiliates, and their respective officers, employees, and agents
              from and against any and all claims, liabilities, damages, losses,
              or expenses (including reasonable attorneys’ fees) arising out of
              or in connection with your submission or breach of these terms.
            </p>

            <p>
              <strong>9. Governing Law and Jurisdiction:</strong> These terms
              shall be governed by and construed in accordance with the laws of
              the United States of America. Any disputes arising under or in
              connection with these terms shall be subject to the exclusive
              jurisdiction of the courts located in Plano, TX 75074.
            </p>

            <p>
              <strong>10. Changes to Terms:</strong> We reserve the right to
              update or modify these terms at any time without prior notice. The
              updated version will be posted on this page and will apply to all
              future submissions.
            </p>
          </div>
        )}

        {/* {modalData.type === "guidelines" && (
          <div className="text-[#5C4033] leading-relaxed space-y-4 text-left overflow-auto sentence max-h-[60vh]">
            <p>
              Thank you for contributing to our archive of handwritten letters
              and analog photographs. To help us preserve your memories in the
              highest quality and ensure they remain accessible for future
              generations, please follow the guidelines below.
            </p>

            <h3 className="text-xl font-bold mt-4">1. Letters</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Submit clear scans or photographs of your letters.</li>
              <li>
                Ensure handwriting is legible and that the entire page (edges
                included) is visible.
              </li>
              <li>Avoid shadows, glare, or cropped corners.</li>
              <li>
                If submitting multiple pages, please number or name them in
                sequence.
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-4">2. Photographs</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Resolution must be at least{" "}
                <strong>1200 x 1800 pixels (300 dpi)</strong>.
              </li>
              <li>
                Images should be sharp, in focus, and free from heavy blur or
                pixelation.
              </li>
              <li>
                Accepted file formats: <strong>JPEG, PNG, or TIFF.</strong>
              </li>
              <li>
                If scanning, please clean the scanner glass to prevent smudges
                or dust marks.
              </li>
              <li>
                Do not apply filters or alterations that change the authenticity
                of the image.
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-4">
              3. Audio recordings (optional)
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                You may submit an audio file of your letter being read aloud or
                a short background story about the photograph/letter.
              </li>
              <li>
                Accepted formats: <strong>MP3, WAV, or AAC.</strong>
              </li>
              <li>Ensure recordings are clear and audible.</li>
            </ul>

            <h3 className="text-xl font-bold mt-4">4. File naming</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                To help us organize the archive, please name your files in a
                clear and descriptive way, for example:
              </li>
              <li className="ml-5 list-[circle]">
                <strong>Letter_Grandfather_1965</strong>
              </li>
              <li className="ml-5 list-[circle]">
                <strong>Photo_Wedding_1972</strong>
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-4">
              5. Additional information (optional but encouraged)
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Date or approximate year</li>
              <li>Location (city, country, or landmark)</li>
              <li>Names of people involved</li>
              <li>A brief description of the occasion or memory</li>
            </ul>

            <h3 className="text-xl font-bold mt-4">
              6. Quick checklist before submitting
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Letters: full page, legible, no glare or blur</li>
              <li>
                Photographs: minimum{" "}
                <strong> 1200 x 1800 px, JPEG/PNG/TIFF</strong> , authentic and
                clear
              </li>
              <li>
                Audio: <strong>MP3/WAV/AAC</strong>, clear recordings (optional)
              </li>
              <li>File naming: use descriptive names</li>
              <li>
                Extra info: date, place, short description (optional but
                helpful)
              </li>
            </ul>

            <p className="mt-4">
              ✨ By carefully preparing your submission, you help ensure that
              your memories are preserved with the clarity, dignity, and
              authenticity they deserve. Thank you for being part of this
              archive.
            </p>
          </div>
        )} */}

        {modalData.type === "guidelines" && (
          <div className="text-[#5C4033] leading-relaxed space-y-4 text-left overflow-auto sentence max-h-[60vh]">
            <p>
              Thank you for contributing to our archive of handwritten letters
              and analog photographs. To help us preserve your memories of the
              highest quality and ensure they remain accessible for future
              generations, please follow the guidelines below.
            </p>

            <h3 className="text-xl font-bold mt-4">Relevance & Storytelling</h3>
            <p>
              We kindly ask that submissions not be random or without context.
              Letters and photographs should carry meaning—whether they capture
              the spirit of an era, tell a personal or historical story, or
              reflect on a cultural moment worth preserving. Submissions that
              help future generations understand the people, places, and
              emotions of their time are most valued in this archive.
            </p>

            <h3 className="text-xl font-bold mt-4">1. Letters</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Submit clear scans or photographs of your letters.</li>
              <li>
                Ensure handwriting is legible and that the entire page (edges
                included) is visible.
              </li>
              <li>Avoid shadows, glare, or cropped corners.</li>
              <li>
                If submitting multiple pages, please number or name them in
                sequence.
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-4">2. Photographs</h3>
            <h4 className="font-semibold mt-2">What we accept</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Orientation: horizontal (landscape), vertical (portrait), or
                square — all welcome.
              </li>
              <li>
                Resolution must be at least{" "}
                <strong>1200 pixels on the long side (100 DPI)</strong>.
              </li>
              <li>
                Images should be sharp, in focus, and free from heavy blur or
                pixelation.
              </li>
              <li>
                Accepted file formats:{" "}
                <strong>JPEG, WebP, PNG, or TIFF.</strong>
              </li>
              <li>
                If scanning, please clean the scanner glass to prevent smudges
                or dust marks.
              </li>
              <li>
                Do not apply filters or alterations that change the authenticity
                of the image.
              </li>
            </ul>

            <h4 className="font-semibold mt-4">
              Rights & Permissions (simple, but important)
            </h4>
            <p>By submitting, you confirm that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                You own the photo or have permission from the owner to share it.
              </li>
              <li>
                You grant us a non-exclusive, royalty-free license to display
                the image on our website, social channels, and in non-commercial
                features about the archive, with credit to you.
              </li>
              <li>
                You will not upload images that infringe on others’ rights.
              </li>
              <li>
                For identifiable living people (especially minors), you have
                their consent (or a guardian’s). If unsure, blur faces or skip
                the upload.
              </li>
              <li>
                You understand we may lightly crop/resize for layout and
                accessibility.
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-4">
              3. Audio Recordings (Optional)
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                You may submit an audio file of your letter being read aloud or
                a short background story about the photograph/letter.
              </li>
              <li>
                Accepted formats: <strong>MP3, WAV, or AAC.</strong>
              </li>
              <li>Ensure recordings are clear and audible.</li>
            </ul>

            <h3 className="text-xl font-bold mt-4">4. File Naming</h3>
            <p>
              To help us organize the archive, please name your files in a clear
              and descriptive way, for example:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Letter_Grandfather_1965</strong>
              </li>
              <li>
                <strong>Photo_Wedding_1972</strong>
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-4">
              5. Additional Information (Optional but Encouraged)
            </h3>
            <p>
              Providing context enriches the archive and helps others understand
              your contribution. You may include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Date or approximate year</li>
              <li>Location (city, country, or landmark)</li>
              <li>Names of people involved</li>
              <li>A brief description of the occasion or memory</li>
            </ul>

            <h3 className="text-xl font-bold mt-4">
              6. Quick Checklist Before Submitting
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Letters: Full page, legible, no glare or blur</li>
              <li>
                Photographs: Minimum 1200 px, JPEG/WebP/PNG/TIFF, authentic and
                clear
              </li>
              <li>Audio: MP3/WAV/AAC, clear recordings (optional)</li>
              <li>File Naming: Use descriptive names</li>
              <li>
                Extra Info: Date, place, short description (optional but
                helpful)
              </li>
            </ul>

            <p className="mt-4">
              ✨ By carefully preparing your submission, you help ensure that
              your memories are preserved with the clarity, dignity, and
              authenticity they deserve. Thank you for being part of this
              archive.
            </p>
          </div>
        )}

        {/* Important Notice */}
        {modalData.type === "notice" && (
          <div className="text-[#5C4033] leading-relaxed space-y-4 text-left overflow-auto sentence max-h-[60vh]">
            <p>
              For letters, please include either a{" "}
              <strong>typed/clearly written version</strong> or an{" "}
              <strong>audio recording</strong> of the text. Submissions without
              one of these may be{" "}
              <strong>rejected if the handwriting is not legible</strong>.
              Adding one ensures your contribution can be properly preserved and
              shared.
            </p>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default SubmissionForm;
