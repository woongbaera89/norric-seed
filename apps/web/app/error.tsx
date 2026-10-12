"use client";
import { useEffect } from "react";
import { Button } from "@norric/design-system";
import { captureError } from "../lib/analytics";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { captureError(error, { digest: error.digest, boundary: "app/error" }); }, [error]);
  return <main className="app"><h1 className="title">문제가 생겼어요</h1><p className="date" style={{ margin: "12px 0 24px" }}>잠시 후 다시 시도해주세요.</p><Button onClick={reset}>다시 시도</Button></main>;
}
