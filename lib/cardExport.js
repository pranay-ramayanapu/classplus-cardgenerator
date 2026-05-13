export const EXPORT_CARD_WIDTH = 1080;
export const EXPORT_CARD_HEIGHT = 1920;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function percentToPx(value, size) {
  const numericValue = Number.parseFloat(String(value));

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return (numericValue / 100) * size;
}

function positionToPixels(position) {
  return {
    top: percentToPx(position.top, EXPORT_CARD_HEIGHT),
    left: percentToPx(position.left, EXPORT_CARD_WIDTH),
  };
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    image.src = src;
  });
}

function drawCoverImage(ctx, image, width, height) {
  // Use "contain" logic - fit entire image within canvas without cropping
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > canvasRatio) {
    // Image is relatively wider - fit to width to prevent clipping
    drawWidth = width;
    drawHeight = width / imageRatio;
    offsetY = (height - drawHeight) / 2;
  } else {
    // Image is relatively taller - fit to height
    drawHeight = height;
    drawWidth = height * imageRatio;
    offsetX = (width - drawWidth) / 2;
  }

  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function drawProfileCircle(ctx, image, x, y, size) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.96)";
  ctx.stroke();
  ctx.clip();
  ctx.drawImage(image, x, y, size, size);
  ctx.restore();
}

function drawNameText(ctx, { x, y, text }) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(15, 23, 42, 0.55)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  
  // Use system font that canvas can measure reliably
  ctx.font = 'bold 72px Arial, sans-serif';
  ctx.textBaseline = "top";
  
  // Calculate available width for text
  const availableWidth = EXPORT_CARD_WIDTH - x - 32;
  
  // Measure text width
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  
  // If text is too wide, reduce font size proportionally
  let fontSize = 72;
  if (textWidth > availableWidth) {
    fontSize = Math.floor((72 * availableWidth) / textWidth);
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  }
  
  ctx.fillText(text, x, y);
  ctx.restore();
}

export async function renderCardToCanvas({ template, userName, profileImage }) {
  if (!template) {
    throw new Error("Template data is missing.");
  }

  const [templateImage, userProfileImage] = await Promise.all([
    loadImage(template.image),
    loadImage(profileImage),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_CARD_WIDTH;
  canvas.height = EXPORT_CARD_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context is not available.");
  }

  drawCoverImage(ctx, templateImage, EXPORT_CARD_WIDTH, EXPORT_CARD_HEIGHT);

  const gradient = ctx.createLinearGradient(0, EXPORT_CARD_HEIGHT, EXPORT_CARD_WIDTH, 0);
  gradient.addColorStop(0, "rgba(15, 23, 42, 0.72)");
  gradient.addColorStop(0.55, "rgba(15, 23, 42, 0.10)");
  gradient.addColorStop(1, "rgba(15, 23, 42, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, EXPORT_CARD_WIDTH, EXPORT_CARD_HEIGHT);

  const profilePosition = positionToPixels(template.profilePosition);
  const profileSize = 180;
  const profileX = clamp(profilePosition.left, 32, EXPORT_CARD_WIDTH - profileSize - 32);
  const profileY = clamp(profilePosition.top, 32, EXPORT_CARD_HEIGHT - profileSize - 32);

  drawProfileCircle(ctx, userProfileImage, profileX, profileY, profileSize);

  const textPosition = positionToPixels(template.textPosition);
  const nameX = clamp(textPosition.left, 32, EXPORT_CARD_WIDTH - 32);
  const nameY = clamp(textPosition.top, 32, EXPORT_CARD_HEIGHT - 120);

  drawNameText(ctx, {
    x: nameX,
    y: nameY,
    text: userName || "Your Name",
  });

  return canvas;
}

export function downloadCanvasAsPng(canvas, fileName = "greeting-card.png") {
  const imageUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = fileName;
  link.click();

  return { canvas, imageUrl };
}

export async function captureCardAsPng(data, fileName = "greeting-card.png") {
  const canvas = await renderCardToCanvas(data);

  return downloadCanvasAsPng(canvas, fileName);
}

export async function shareCardImage(data, title = "Greeting Card") {
  const canvas = await renderCardToCanvas(data);
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
        return;
      }

      reject(new Error("Unable to create an image file."));
    }, "image/png");
  });

  const file = new File([blob], "greeting-card.png", { type: "image/png" });

  if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
    throw new Error("Native share sheet is not available on this browser/device.");
  }

  await navigator.share({
    title,
    text: "Check out this greeting card",
    files: [file],
  });

  return { mode: "share" };
}
