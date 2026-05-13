import React, { Suspense } from "react";
import EditorClient from "./EditorClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading editor...</div>}>
      <EditorClient />
    </Suspense>
  );
}
