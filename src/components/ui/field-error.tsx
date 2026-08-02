import * as React from "react";

export const FieldError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-sm font-semibold text-clay" role="alert">
      {message}
    </p>
  );
};
