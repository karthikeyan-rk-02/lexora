const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Brand SVG (Rounded Squircle for standard displays)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="lexoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="50%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#7C3AED" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#312E81" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background Squircle -->
  <rect width="512" height="512" rx="112" fill="url(#lexoraGrad)" />

  <!-- Inner Soft Glow -->
  <circle cx="256" cy="180" r="160" fill="#FFFFFF" opacity="0.08" />

  <!-- Lexora Open Book Emblem -->
  <g filter="url(#shadow)" transform="translate(106, 116) scale(12.5)" fill="none" stroke="#FFFFFF" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left page -->
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="#FFFFFF" fill-opacity="0.2" />
    <!-- Right page -->
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="#FFFFFF" fill-opacity="0.2" />
    <!-- Page accent lines -->
    <path d="M6 8h4" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.8" />
    <path d="M6 12h4" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.8" />
    <path d="M14 8h4" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.8" />
    <path d="M14 12h4" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.8" />
  </g>
</svg>`;

// 2. Maskable SVG (Full-bleed square, icon centered inside 70% safe zone)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="lexoraGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="50%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#7C3AED" />
    </linearGradient>
    <filter id="shadowMask" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#312E81" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Full-bleed background for Android crop -->
  <rect width="512" height="512" fill="url(#lexoraGradFull)" />

  <!-- Inner Soft Glow -->
  <circle cx="256" cy="220" r="140" fill="#FFFFFF" opacity="0.08" />

  <!-- Lexora Open Book Emblem centered strictly in 70% Safe Zone -->
  <g filter="url(#shadowMask)" transform="translate(136, 146) scale(10)" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left page -->
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="#FFFFFF" fill-opacity="0.25" />
    <!-- Right page -->
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="#FFFFFF" fill-opacity="0.25" />
    <!-- Page accent lines -->
    <path d="M6 8h4" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.8" />
    <path d="M6 12h4" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.8" />
    <path d="M14 8h4" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.8" />
    <path d="M14 12h4" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.8" />
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), maskableSvg);
console.log('Generated icon.svg and icon-maskable.svg');

async function renderPngs() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  async function renderSvgToPng(svgContent, size, outputPath) {
    const html = `<!DOCTYPE html>
<html>
  <head>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body, html { width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
      svg { width: 100%; height: 100%; display: block; }
    </style>
  </head>
  <body>
    ${svgContent}
  </body>
</html>`;

    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html);
    await page.screenshot({ path: outputPath, omitBackground: true, type: 'png' });
    console.log(`Rendered ${path.basename(outputPath)} (${size}x${size})`);
  }

  // 192x192 PNG (standard)
  await renderSvgToPng(standardSvg, 192, path.join(publicDir, 'pwa-192x192.png'));

  // 512x512 PNG (standard)
  await renderSvgToPng(standardSvg, 512, path.join(publicDir, 'pwa-512x512.png'));

  // 512x512 Maskable PNG
  await renderSvgToPng(maskableSvg, 512, path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 180x180 Apple Touch Icon (iOS Safari)
  await renderSvgToPng(standardSvg, 180, path.join(publicDir, 'apple-touch-icon.png'));

  // 32x32 Favicon PNG
  await renderSvgToPng(standardSvg, 32, path.join(publicDir, 'favicon.png'));

  await browser.close();
  console.log('All PWA PNG icons rendered successfully!');
}

renderPngs().catch((err) => {
  console.error('Error rendering PNG icons:', err);
  process.exit(1);
});
