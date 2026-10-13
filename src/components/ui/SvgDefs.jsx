/** Shared SVG <symbol> sketches (underline, zig-zag, circle, arrow) used via <use href="#id">. */
export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="ul" viewBox="0 0 300 24">
          <path pathLength="1" d="M4 15C40 5 70 21 110 11S190 5 230 14 280 15 296 8" />
        </symbol>
        <symbol id="zz" viewBox="0 0 60 220">
          <path
            pathLength="1"
            d="M10 6L50 24L10 42L50 60L10 78L50 96L10 114L50 132L10 150L50 168L10 186L50 204"
          />
        </symbol>
        <symbol id="ci" viewBox="0 0 400 90">
          <path pathLength="1" d="M200 8C100 4 10 20 10 46S100 86 200 84 392 66 390 42 300 6 160 12" />
        </symbol>
        <symbol id="ar" viewBox="0 0 120 80">
          <path pathLength="1" d="M6 10C40 4 90 20 100 62M100 62L82 50M100 62L112 44" />
        </symbol>
      </defs>
    </svg>
  );
}
