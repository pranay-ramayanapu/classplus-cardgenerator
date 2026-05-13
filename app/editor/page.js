import React, { Suspense } from "react";
import EditorClient from "./EditorClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading editor...</div>}>
      <EditorClient />
    </Suspense>
  );
}
                  zIndex: 20,
                  color: "white",
                  textShadow: "0 8px 24px rgba(15, 23, 42, 0.55)",
                })}
              >
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
                  {userName || "Your Name"}
                </h2>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
