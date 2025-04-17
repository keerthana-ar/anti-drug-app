const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = {
  icon: 1024,
  splash: 1242,
  adaptiveIcon: 1024,
  favicon: 196
};

async function generateIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();

  // Draw white circle
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Draw border
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = size * 0.05;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size * 0.4, 0, Math.PI * 2);
  ctx.stroke();

  // Draw diagonal line
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size * 0.3, size * 0.3);
  ctx.lineTo(size * 0.7, size * 0.7);
  ctx.stroke();

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

async function generateAssets() {
  const assetsDir = path.join(__dirname, '../assets');

  // Create assets directory if it doesn't exist
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
  }

  // Generate icons
  await generateIcon(sizes.icon, path.join(assetsDir, 'icon.png'));
  await generateIcon(sizes.splash, path.join(assetsDir, 'splash.png'));
  await generateIcon(sizes.adaptiveIcon, path.join(assetsDir, 'adaptive-icon.png'));
  await generateIcon(sizes.favicon, path.join(assetsDir, 'favicon.png'));

  console.log('Icons generated successfully!');
}

generateAssets().catch(console.error); 