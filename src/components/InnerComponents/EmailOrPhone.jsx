import React from "react";

const EmailOrPhone = ({
  label,
  value,
  type = "text", // "email" | "phone" | "text"
}) => {
  // clickable link generate karna
  let href = null;
  if (type === "email") href = `mailto:${value}`;
  if (type === "phone") href = `tel:${value}`;

  return (
    <div className="flex flex-col gap-1 mb-4">
      <div className="font-semibold text-xl">{label}</div>
      {href ? (
        <a
          href={href}
          className="text-2xl  hover:underline"
          style={{ fontFamily: "Ephesis" }}
        >
          {value}
        </a>
      ) : (
        <div className="text-xl" style={{ fontFamily: "Ephesis" }}>
          {value}
        </div>
      )}
    </div>
  );
};

export default EmailOrPhone;
