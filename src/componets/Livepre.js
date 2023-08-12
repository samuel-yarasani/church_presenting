import React from "react";

export default function Livepre() {
  return (
    <iframe
      title="preview"
      src={window.location.origin + "/live"}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
}
