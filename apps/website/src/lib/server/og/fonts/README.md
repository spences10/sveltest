# Share card fonts

Static Inter weights 400 and 700, derived from the Latin WOFF2 in
`@fontsource-variable/inter@5.3.0` using FontTools
`instantiateVariableFont` (weight pinned, other axes at their
defaults). The SIL Open Font License is included in `OFL.txt`.

These TTF files are bundled as inline data and passed to WASM Resvg as
in-memory font buffers. Card rendering needs neither filesystem access
nor network requests in Node or Cloudflare Workers.
