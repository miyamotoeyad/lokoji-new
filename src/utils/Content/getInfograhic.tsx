import { InfographicSkeleton } from "@/types/contentfulType";
import { Entry } from "contentful";
import { client } from "../contentful";

export type InfographicEntry = Entry<InfographicSkeleton, undefined, string>;

export const getInfographic = async (slug: string) => {
  const res = await client.getEntries<InfographicSkeleton>({
    content_type: "infographic",
    "fields.slug": slug,
    include: 2,
  });
  return res.items[0] ?? null;
};

export const getInfographics = async () => {
  const res = await client.getEntries<InfographicSkeleton>({
    content_type: "infographic",
    order: ["-fields.publicationDate" as never],
    include: 2,
  });
  return res.items;
};

export const getInfographicSlugs = async () => {
  const res = await client.getEntries<InfographicSkeleton>({
    content_type: "infographic",
    select: ["fields.slug"] as never[],
  });
  return res.items.map((item) => item.fields.slug as string);
};