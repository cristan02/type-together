import { Document } from "@/app/[id]/document";

export async function generateStaticParams() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/docs`).then(
    (res) => res.json()
  );

  return data.data.map((item: any) => ({
    id: item.documentId,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (!id) {
    return null;
  }

  return <Document params={{ id }} />;
}
