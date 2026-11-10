import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  CanvasTexture,
  PlaneGeometry,
  DoubleSide,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  WebGLRenderer,
} from 'three';
import { canUseMouseFx, prefersReducedMotion } from '../utils/media';

const FOV = 50;
const CAM_Z = 10;
const TAN = Math.tan((FOV / 2) * (Math.PI / 180));

/**
 * The floating shapes. `at` picks a section (and how far down it, 0-1), `side` the screen edge,
 * `edge` how close to that edge, `z` the depth (further = slower = parallax), `fill` the palette key.
 */
const SHAPES = [
  { geo: () => new TorusKnotGeometry(1, 0.34, 120, 14), at: ['.hero', 0.3], side: 1, edge: 0.8, z: -3, size: 1.25, fill: 'accent', spin: [0.1, 0.16] },
  { geo: () => new IcosahedronGeometry(1, 0), at: ['.hero', 1.18], side: -1, edge: 0.85, z: -6, size: 1.6, wire: 'secondary', spin: [0.07, 0.1] },
  { geo: () => new TorusGeometry(1, 0.36, 14, 40), at: ['#about', 0.85], side: -1, edge: 1.0, z: -2, size: 0.95, fill: 'secondary', spin: [0.16, 0.1] },
  { geo: () => new TetrahedronGeometry(1, 0), at: ['#projects', 0.5], side: -1, edge: 0.96, z: -2, size: 1, fill: 'accent', spin: [0.22, 0.14] },
  { geo: () => new OctahedronGeometry(1, 0), at: ['#experience', 0.75], side: -1, edge: 1.0, z: -4, size: 1.5, wire: 'secondary', spin: [0.09, 0.13] },
];

/**
 * Coding-themed pieces: sticker glyphs (`text`) and little code-editor windows (`code`).
 * Same placement fields as SHAPES; `tilt` is the resting angle in radians.
 */
const GLYPH_FONT = "900 170px Archivo, 'Helvetica Neue', Arial, sans-serif";
const MONO = "700 27px Consolas, Menlo, 'Courier New', monospace";
const DEV = [
  // Everything sits on the right half: bare text lives on the left, and the right is covered by cards/photo or empty.
  { text: '</>', color: '#f4b400', at: ['#about', 0.55], side: 1, edge: 0.9, z: -1, size: 0.95, tilt: -0.18 },
  { text: '.NET', color: '#5b5bd6', textColor: '#fffaf0', at: ['#about', 0.08], side: 1, edge: 0.95, z: -2, size: 0.8, tilt: 0.12 },
  { text: ';', color: '#5b5bd6', textColor: '#fffaf0', at: ['.hero', 0.82], side: 1, edge: 1.0, z: -2, size: 1.3, tilt: 0.2 },
  { text: 'C#', color: '#5b5bd6', textColor: '#fffaf0', at: ['#projects', 0.28], side: 1, edge: 0.98, z: -1, size: 1.1, tilt: 0.16 },
  { text: 'SQL', color: '#ff7a1a', at: ['#projects', 0.74], side: 1, edge: 0.62, z: -3, size: 0.95, tilt: -0.12 },
  { text: '=>', color: '#f4b400', at: ['#experience', 0.38], side: 1, edge: 0.85, z: -1, size: 0.85, tilt: 0.14 },
  { text: '{ }', color: '#ff7a1a', at: ['#experience', 0.88], side: 1, edge: 0.6, z: -2, size: 1.0, tilt: -0.2 },
  {
    code: ['public class Dev : Human {', '  string Name = "Vivek";', '  async Task Ship() {', '    await Build(); // done', '  }', '}'],
    title: 'Dev.cs', at: ['#experience', 0.1], side: 1, edge: 0.82, z: -3, size: 1, tilt: 0.1,
  },
  {
    code: ['SELECT idea, impact', 'FROM backlog', 'WHERE ready = 1', 'ORDER BY impact DESC;'],
    title: 'query.sql', at: ['#projects', 0.5], side: 1, edge: 1.08, z: -4, size: 1, tilt: -0.1,
  },
  {
    code: ['$ dotnet new webapi', '$ dotnet run', '> listening on :5000', '> 200 OK  (3ms)'],
    title: 'terminal', at: ['#experience', 0.62], side: 1, edge: 1.0, z: -4, size: 1, tilt: 0.12,
  },
];

const KEYWORDS = new Set(['public', 'class', 'async', 'await', 'string', 'SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'DESC', 'new', 'dotnet', 'run']);
const TYPES = new Set(['Human', 'Task', 'Dev']);
const rounded = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

/** Sticker-style glyph: fat dark outline + hard offset shadow, like the page's buttons. */
function glyphTexture(text, color, textColor = '#121212') {
  const probe = document.createElement('canvas').getContext('2d');
  probe.font = GLYPH_FONT;
  const w = Math.ceil(probe.measureText(text).width) + 120;
  const h = 300;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.font = GLYPH_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  const cx = w / 2 - 8;
  const cy = h / 2 - 8;
  ctx.lineWidth = 46;
  ctx.strokeStyle = '#121212';
  ctx.strokeText(text, cx + 16, cy + 16); // shadow
  ctx.fillStyle = '#121212';
  ctx.fillText(text, cx + 16, cy + 16);
  ctx.strokeStyle = '#121212';
  ctx.strokeText(text, cx, cy);
  // Coloured pill-less fill: draw the glyph in `color`, then a thin inner highlight in textColor for the contrast ones.
  ctx.fillStyle = color;
  ctx.lineWidth = 0;
  ctx.fillText(text, cx, cy);
  if (textColor !== '#121212') {
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.18;
    ctx.fillText(text, cx, cy - 6);
    ctx.globalAlpha = 1;
  }
  return { canvas, aspect: w / h };
}

/** A tiny dark editor window with syntax-coloured lines. */
function panelTexture(lines, title) {
  const lineH = 44;
  const w = 720;
  const h = 96 + lines.length * lineH + 36;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  rounded(ctx, 6, 6, w - 12, h - 12, 14);
  ctx.fillStyle = '#1d1a13';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#121212';
  ctx.stroke();
  // title bar
  ctx.save();
  rounded(ctx, 6, 6, w - 12, h - 12, 14);
  ctx.clip();
  ctx.fillStyle = '#f4b400';
  ctx.fillRect(0, 0, w, 66);
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 62, w, 6);
  ctx.restore();
  ['#ff7a1a', '#fffaf0', '#5b5bd6'].forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(46 + i * 38, 34, 11, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#121212';
    ctx.stroke();
  });
  ctx.font = "800 24px Archivo, Arial, sans-serif";
  ctx.fillStyle = '#121212';
  ctx.textAlign = 'right';
  ctx.fillText(title, w - 36, 42);
  ctx.textAlign = 'left';
  ctx.font = MONO;
  lines.forEach((line, i) => {
    const y = 66 + 56 + i * lineH;
    ctx.fillStyle = '#6f6a58';
    ctx.fillText(String(i + 1), 30, y);
    let x = 84;
    for (const tok of line.match(/\/\/.*$|"[^"]*"|\w+|\s+|./g) || []) {
      let color = '#f4ecd8';
      if (tok.startsWith('//')) color = '#8a8470';
      else if (tok.startsWith('"')) color = '#ff7a1a';
      else if (KEYWORDS.has(tok)) color = '#a5a5ff';
      else if (TYPES.has(tok)) color = '#f4b400';
      else if (/^\d+$/.test(tok) || tok === '$' || tok === '>') color = '#ff7a1a';
      ctx.fillStyle = color;
      ctx.fillText(tok, x, y);
      x += ctx.measureText(tok).width;
    }
  });
  return { canvas, aspect: w / h };
}

const toTexture = (canvas, renderer) => {
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  return tex;
};

const readPalette = () => {
  const css = getComputedStyle(document.documentElement);
  const get = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
  return {
    accent: get('--accent', '#f4b400'),
    accent2: get('--accent2', '#ff7a1a'),
    secondary: get('--secondary', '#5b5bd6'),
    ink: get('--border', '#121212'),
  };
};

/** Soft square-ish dust that gives the page a deep star-field to parallax against. */
function makeDust(count, spreadX, spreadY, depth) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spreadX;
    pos[i * 3 + 1] = -Math.random() * spreadY;
    pos[i * 3 + 2] = -Math.random() * depth + 2;
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  return geo;
}

/**
 * Fixed WebGL backdrop: neo-brutalist 3D shapes (inverted-hull outlines, flat shading) that are
 * pinned to page sections but sit at different depths, so scrolling gives true perspective parallax.
 * The pointer tilts the camera and scroll speed makes everything spin faster.
 */
export default function Scene3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      canvas.remove();
      return undefined;
    }

    const small = innerWidth < 700;
    renderer.setClearColor(0x000000, 0);
    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 80);
    camera.position.set(0, 0, CAM_Z);

    scene.add(new AmbientLight(0xffffff, 1.35));
    const sun = new DirectionalLight(0xffffff, 2.1);
    sun.position.set(-4, 6, 8);
    scene.add(sun);

    let palette = readPalette();
    const tint = {}; // palette key -> shared THREE.Color so a theme switch recolours everything at once
    const syncPalette = () => {
      palette = readPalette();
      Object.entries(palette).forEach(([key, value]) => (tint[key] ||= new Color()).set(value));
    };
    syncPalette();

    // Build the shapes.
    const items = SHAPES.map((def) => {
      const holder = new Group();
      const spinner = new Group();
      holder.add(spinner);
      const geo = def.geo();
      if (def.wire) {
        const edges = new LineSegments(new EdgesGeometry(geo), new LineBasicMaterial({ color: tint[def.wire], transparent: true, opacity: 0.85 }));
        spinner.add(edges);
        const mat = edges.material;
        mat.color = tint[def.wire];
      } else {
        const solid = new Mesh(geo, new MeshLambertMaterial({ color: tint[def.fill], flatShading: true }));
        const outline = new Mesh(geo, new MeshBasicMaterial({ color: tint.ink, side: BackSide }));
        outline.scale.setScalar(1.08);
        spinner.add(outline, solid);
        solid.material.color = tint[def.fill];
        outline.material.color = tint.ink;
      }
      spinner.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      scene.add(holder);
      return { def, holder, spinner, phase: Math.random() * 6.28, anchorY: 0 };
    });

    // Two layers of dust: ink specks and orange specks.
    const dustInk = new Points(makeDust(small ? 70 : 170, 36, 60, 26), new PointsMaterial({ color: tint.ink, size: 0.07, transparent: true, opacity: 0.45 }));
    const dustHot = new Points(makeDust(small ? 25 : 60, 36, 60, 26), new PointsMaterial({ color: tint.accent2, size: 0.11, transparent: true, opacity: 0.8 }));
    dustInk.material.color = tint.ink;
    dustHot.material.color = tint.accent2;
    scene.add(dustInk, dustHot);

    // ---- layout: world units <-> page pixels ------------------------------------------------
    let width = 1;
    let height = 1;
    let upp = 0.01; // world units per CSS pixel at the focal plane
    let docH = 1;
    const layout = () => {
      width = innerWidth;
      height = innerHeight;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      upp = (2 * TAN * CAM_Z) / height;
      docH = document.documentElement.scrollHeight;
      const compact = width < 900;
      for (const it of items) {
        const [selector, frac] = it.def.at;
        const el = document.querySelector(selector);
        const top = el ? el.offsetTop + el.offsetHeight * frac : docH * 0.5;
        const dist = CAM_Z - it.def.z;
        it.holder.position.set(
          it.def.side * TAN * dist * camera.aspect * (compact ? 1.02 : it.def.edge),
          -(top - height / 2) * upp,
          it.def.z,
        );
        it.holder.scale.setScalar(it.def.size * (compact ? 0.55 : 1));
      }
      // Dust is spread over the whole page height.
      const worldDocH = docH * upp;
      dustInk.scale.y = dustHot.scale.y = Math.max(1, worldDocH / 60);
      dustInk.position.y = dustHot.position.y = height * upp * 0.5;
    };
    layout();

    // Coding-themed glyph stickers + code windows. Built once the web fonts are ready so the text renders right.
    let disposed = false;
    const addDev = () => {
      if (disposed) return;
      for (const def of DEV) {
        const holder = new Group();
        const spinner = new Group();
        holder.add(spinner);
        const isPanel = Boolean(def.code);
        const { canvas: art, aspect } = isPanel ? panelTexture(def.code, def.title) : glyphTexture(def.text, def.color, def.textColor);
        const h = isPanel ? 1.9 : 1.35;
        const geo = new PlaneGeometry(h * aspect, h);
        const face = new Mesh(geo, new MeshBasicMaterial({ map: toTexture(art, renderer), transparent: true, side: DoubleSide }));
        if (isPanel) {
          // hard offset shadow, like the cards on the page
          const shadow = new Mesh(geo, new MeshBasicMaterial({ color: 0x121212, side: DoubleSide }));
          shadow.position.set(0.1, -0.1, -0.02);
          spinner.add(shadow);
        }
        spinner.add(face);
        spinner.rotation.z = def.tilt;
        scene.add(holder);
        items.push({ def, holder, spinner, phase: Math.random() * 6.28, dev: true });
      }
      layout();
    };
    (document.fonts?.ready ?? Promise.resolve()).then(addDev);

    // ---- input -------------------------------------------------------------------------------
    let mx = 0;
    let my = 0;
    const onMove = (e) => {
      mx = (e.clientX / innerWidth - 0.5) * 2;
      my = (e.clientY / innerHeight - 0.5) * 2;
    };
    if (canUseMouseFx) addEventListener('pointermove', onMove, { passive: true });

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 120);
    };
    addEventListener('resize', onResize);
    // Fonts / images / revealed content change the page height after first paint.
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    // Re-tint when the user flips light/dark.
    const themeObserver = new MutationObserver(() => syncPalette());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const media = matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', syncPalette);

    // ---- loop --------------------------------------------------------------------------------
    let raf = 0;
    let camY = -scrollY * upp;
    let camX = 0;
    let tiltX = 0;
    let tiltY = 0;
    let lastScroll = scrollY;
    let velocity = 0;
    let last = performance.now();
    let t = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      // Scroll -> camera (eased so it trails the page a touch, which reads as depth).
      const targetY = -scrollY * upp;
      camY += (targetY - camY) * Math.min(1, dt * 9);
      velocity += ((scrollY - lastScroll) / Math.max(dt, 0.001) / 1000 - velocity) * Math.min(1, dt * 6);
      lastScroll = scrollY;

      // Pointer -> camera drift + tilt.
      camX += (mx * 0.9 - camX) * Math.min(1, dt * 3);
      tiltX += (-my * 0.05 - tiltX) * Math.min(1, dt * 3);
      tiltY += (-mx * 0.06 - tiltY) * Math.min(1, dt * 3);
      camera.position.set(camX, camY - my * 0.5, CAM_Z);
      camera.rotation.set(tiltX, tiltY, 0);

      const boost = prefersReducedMotion ? 0 : 1 + Math.min(Math.abs(velocity) * 1.6, 6);
      for (const it of items) {
        if (it.dev) {
          // Code pieces stay readable: they sway toward the pointer/scroll instead of tumbling.
          const sway = prefersReducedMotion ? 0 : 1;
          it.spinner.rotation.y = (Math.sin(t * 0.6 + it.phase) * 0.4 + Math.max(-0.6, Math.min(0.6, velocity * 0.25)) + mx * 0.15) * sway;
          it.spinner.rotation.x = Math.sin(t * 0.45 + it.phase) * 0.14 * sway;
          it.spinner.position.y = Math.sin(t * 0.8 + it.phase) * 0.14 * sway;
          continue;
        }
        const [sx, sy] = it.def.spin;
        it.spinner.rotation.x += sx * dt * boost * 0.6;
        it.spinner.rotation.y += sy * dt * boost * 0.6;
        if (!prefersReducedMotion) it.spinner.position.y = Math.sin(t * 0.8 + it.phase) * 0.18;
      }
      dustInk.rotation.y = Math.sin(t * 0.05) * 0.04;
      renderer.render(scene, camera);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(frame);
    // Let the CSS know the scene is alive (the page nudges a few colours when it is).
    document.documentElement.classList.add('gl');

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      removeEventListener('resize', onResize);
      removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', syncPalette);
      themeObserver.disconnect();
      ro.disconnect();
      document.documentElement.classList.remove('gl');
      scene.traverse((o) => {
        o.geometry?.dispose();
        const m = o.material;
        (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => {
          x.map?.dispose();
          x.dispose();
        });
      });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="gl3d" aria-hidden="true" />;
}
