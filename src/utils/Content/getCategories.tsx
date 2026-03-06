import { client } from "../contentful";

export default async function getArticles() {
  await new Promise(resolve => setTimeout(resolve, 300))

  const res = await client.getEntries({ content_type: "category" });

  return res.items;
}
