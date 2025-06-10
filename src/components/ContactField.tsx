import React from "react";

type ContactFieldProps = {
  label: string;
  value?: string | null;
  boldValue?: boolean;
};

export default function ContactField({ label, value, boldValue = false }: ContactFieldProps) {
  return (
    <div className="flex flex-row gap-2 mb-2 w-full justify-between">
      <div>{label}</div>
      <div className={boldValue ? "font-semibold" : ""}>{value || "-"}</div>
    </div>
  );
}
