const CheckboxField = ({
  label,
  name,
  checked = false,
  onChange,
  required = false,
  className = "",
}) => (
  <div className={`flex items-center ${className}`}>
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      required={required}
      className="w-4 h-4 text-[#4A2C2A] border-[#8B4513]/50 rounded focus:ring-2 focus:ring-[#4A2C2A] focus:outline-none cursor-pointer"
    />
    <label htmlFor={name} className="ml-3 text-sm text-[#5C4033] cursor-pointer">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
  </div>
);

export default CheckboxField;
