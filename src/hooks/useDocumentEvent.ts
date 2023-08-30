import { useEffect } from "react";

const useDocumentEvent = <K extends keyof DocumentEventMap>(
  type: K,
  ...handlers: Array<(e: DocumentEventMap[K], type: K) => void>
) => {
  const handler = (e: DocumentEventMap[K]) => handlers.forEach((h) => h(e, type));
  useEffect(() => {
    document.addEventListener(type, handler, true);
    return () => {
      document.removeEventListener(type, handler, true);
    };
  }, []);
};

export default useDocumentEvent;
