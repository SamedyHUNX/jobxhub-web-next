"use client";

import { useParams } from "next/navigation";

export default function OrgByIdPage() {
  const { orgId } = useParams();
  return <h1 className="text-white">{orgId}</h1>;
}
