import { Metadata } from "next";

export default function SEO({
  title,
  description,
  keywords,
  banner_image,
  ogType,
  ogPublishedTime,
  ogAuthor,
}: {
  title: string;
  description: string;
  keywords?: string[];
  banner_image?: string;
  ogType?: string;
  ogPublishedTime?: string;
  ogAuthor?: string;
}): Metadata {
  return {
    metadataBase: new URL("http://localhost:3000"),
    title: title,
    description: description,
    keywords: keywords
      ? keywords
      : [
          "DEFAULT KEYWORDS"
        ],
    openGraph:
      ogType == "article"
        ? {
            title: title,
            description: description,
            siteName: "SITE NAME",
            images: [
              {
                url: banner_image
                  ? banner_image
                  : process.env.NEXT_PUBLIC_BASE_URL + "/seo/banner.png",
                width: 1500,
                height: 500,
                alt: title,
              },
            ],
            locale: "en-US",
            type: "article",
            publishedTime: ogPublishedTime,
            authors: [ogAuthor ? ogAuthor : ""],
          }
        : {
            title: title,
            description: description,
            siteName: "SITE NAME",
            images: [
              {
                url: banner_image
                  ? banner_image
                  : process.env.NEXT_PUBLIC_BASE_URL + "/seo/banner.png",
                width: 1500,
                height: 500,
                alt: title,
              },
            ],
            locale: "en-US",
            type: "website",
          },
    themeColor: "white",
    icons: {
      icon: [
        {
          url: process.env.NEXT_PUBLIC_BASE_URL + "/seo/icon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: process.env.NEXT_PUBLIC_BASE_URL + "/seo/icon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: process.env.NEXT_PUBLIC_BASE_URL + "/seo/icon-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          url: process.env.NEXT_PUBLIC_BASE_URL + "/seo/icon.png",
          sizes: "1024x1024",
          type: "image/png",
        },
      ],
      shortcut: [process.env.NEXT_PUBLIC_BASE_URL + "/seo/icon.png"],
      apple: [
        {
          url: process.env.NEXT_PUBLIC_BASE_URL + "/seo/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
        {
          url: process.env.NEXT_PUBLIC_BASE_URL + "/seo/icon.png",
          sizes: "1024x1024",
          type: "image/png",
        },
        {
          url: process.env.NEXT_PUBLIC_BASE_URL + "/seo/icon-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [
        banner_image
          ? banner_image
          : process.env.NEXT_PUBLIC_BASE_URL + "/seo/banner.png",
      ],
    },
  };
}
