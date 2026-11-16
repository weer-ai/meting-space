/**
 * Renders copy that may contain [TBD] placeholders as red labels.
 *   "[TBD]"            -> boxed red label (a placeholder standing on its own)
 *   "[month TBD]" etc. -> red inline text (a placeholder inside a sentence)
 * The words themselves are never changed.
 */
export default function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]*TBD[^\]]*\])/);
  return (
    <>
      {parts.map((p, i) =>
        /^\[[^\]]*TBD[^\]]*\]$/.test(p) ? (
          <span key={i} className={p === "[TBD]" ? "tbd" : "tbd-inline"}>
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
