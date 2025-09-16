import React from "react";

const ContactDetail = ({
  title = "How to Contact Us",
  description = "We welcome your questions, comments, and feedback. Please choose a way to get in touch or fill out the form.",
  containerClass = "flex flex-col gap-2 mb-8",
  titleClass = "text-3xl font-semibold",
  descriptionClass = "text-2xl",
  descriptionStyle = { fontFamily: "Ephesis" },
}) => {
  return (
    <div className={containerClass}>
      <h2 className={titleClass}>{title}</h2>
      <p className={descriptionClass} style={descriptionStyle}>
        {description}
      </p>
    </div>
  );
};

export default ContactDetail;
