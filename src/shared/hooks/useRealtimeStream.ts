import { useEffect, useState } from "react";

interface RealtimeStreamOptions {
  url: string;
  onMessage?: (data: any) => void;
  enabled?: boolean;
}

export function useRealtimeStream({ url, onMessage, enabled = true }: RealtimeStreamOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [latestData, setLatestData] = useState<any>(null);

  useEffect(() => {
    if (!enabled) return;

    let ws: WebSocket | null = null;
    let eventSource: EventSource | null = null;

    if (url.startsWith("ws://") || url.startsWith("wss://")) {
      ws = new WebSocket(url);
      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => setIsConnected(false);
      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setLatestData(parsed);
          onMessage?.(parsed);
        } catch {
          setLatestData(event.data);
        }
      };
    } else {
      // SSE Fallback
      eventSource = new EventSource(url);
      eventSource.onopen = () => setIsConnected(true);
      eventSource.onerror = () => setIsConnected(false);
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setLatestData(parsed);
          onMessage?.(parsed);
        } catch {
          setLatestData(event.data);
        }
      };
    }

    return () => {
      ws?.close();
      eventSource?.close();
    };
  }, [url, enabled]);

  return { isConnected, latestData };
}
