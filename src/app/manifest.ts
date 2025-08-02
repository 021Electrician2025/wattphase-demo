import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WattPhase",
    description:
      "monitors power levels in real time and provides a smart response mechanism during electrical outages",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon-196.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
