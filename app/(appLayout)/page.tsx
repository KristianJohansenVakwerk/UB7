import ClientPage from "./clientPage";
import { sanityFetch } from "@/sanity/lib/live";
import { sectionsData } from "./utils/data";
import { sectionsQuery } from "@/sanity/queries/queries";
import { notFound } from "next/navigation";
import { richTextToHTML } from "./utils/utils";

export default async function HomeRoute() {
  const { data: sections } = await sanityFetch({
    query: sectionsQuery,
  });

  if (!sections) {
    return notFound();
  }

  return (
    <>
      <ClientPage data={sections} lang="en" />
    </>
  );
}
