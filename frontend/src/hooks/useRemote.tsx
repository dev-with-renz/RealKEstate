import { useEffect, useState } from "react";
import { getErrorMessage } from "../lib/api";

export type Remote<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };

/** Minimal data-fetching hook: loading / error / ready, cancel on unmount, retry(). */
export function useRemote<T>(load: () => Promise<T>, deps: readonly unknown[]) {
  const [state, setState] = useState<Remote<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    load()
      .then((data) => alive && setState({ status: "ready", data }))
      .catch((error: unknown) => alive && setState({ status: "error", message: getErrorMessage(error) }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { state, retry: () => setAttempt((n) => n + 1) };
}
