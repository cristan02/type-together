import { Document } from "@/app/[documentId]/document";

export async function generateStaticParams() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/docs`, {
    headers: {
      Authorization: `Bearer ${process.env.STPAPI_API_KEY}`,
    },
  }).then((res) => res.json());

  const paths = data.data.map((item: any) => ({
    documentId: item.documentId,
  }));

  return paths;
}

export default async function Page({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const documentId = (await params).documentId;
  if (!documentId) {
    return null;
  }

  return <Document params={{ documentId }} />;
}
