export function unescape_alg(alg: string): string {
  if (!alg) {
    return alg;
  }
  var unescaped = alg;
  unescaped = unescaped.replace(/-/g, "'").replace(/&#45;/g, "-");
  unescaped = unescaped.replace(/\+/g, " ").replace(/&#2b;/g, "+"); // Recognize + as space. Many URL encodings will do this.
  unescaped = unescaped.replace(/_/g, " ").replace(/&#95;/g, "_");
  return unescaped;
}
