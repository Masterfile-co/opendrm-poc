import React from "react";

export interface ITextInputField {
  id: string;
  type: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextInputField(props: ITextInputField) {
  const { id, type, value, onChange, placeholder } = props;
  return (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={(e) => {
        e.preventDefault();
        onChange(e.target.value);
      }}
      placeholder={placeholder}
      required
      className="appearance-none block w-full text-[#8D8D8E] bg-[#313133] rounded text-sm py-4 px-6 font-secondary"
    />
  );
}
