import "./style.css";
import Color from "color";
import convert from 'color-convert';
import { jsPDF } from "jspdf";

const formatSelect = document.getElementById("format");

document.getElementById("extractColorsBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getColors" }, (response) => {
      if (chrome.runtime.lastError) {
        console.log(
          "No content script found or site not supported:",
          chrome.runtime.lastError.message
        );
        errorHandler();
        return;
      }

      if (
        response &&
        response.colors &&
        response.url &&
        response.backgroundColors
      ) {
        console.log("Colors extracted from URL:", response.url);
        console.log("Text Colors:", response.colors);
        console.log("Background Colors:", response.backgroundColors);
        allColors(response.colors, response.backgroundColors);
        displayColors(response.colors);
        backColors(response.backgroundColors);
        updateUrl(response.url);
      } else {
        console.log("Unexpected response format:", response);
      }
    });
  });
});


document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  generatePdf();
});


function errorHandler() {
  const urlInput = document.getElementById("urlInput");
  const container = document.getElementById("colors");
  const backColors = document.getElementById("backcolors");
  const allColors = document.getElementById("allColors");
  urlInput.textContent = "Not found url";
  allColors.innerHTML = `<p class="text-red-500">No content script found or site not supported.: please reload site</p>`;
  container.innerHTML = "";
  backColors.innerHTML = "";
  container.innerHTML = "";
}

function updateUrl(url) {
  const urlInput = document.getElementById("urlInput");
  urlInput.textContent = url;
}

function allColors(colors, backgroundColors) {
  const all = [...new Set([...colors, ...backgroundColors])];
  const container = document.getElementById("allColors");
  container.innerHTML = "<h2 class='text-lg font-bold mb-2'>All Colors</h2>";
  renderColors(all, container);
}

function displayColors(colors) {
  const container = document.getElementById("colors");
  container.innerHTML = "<h2 class='text-lg font-bold mb-2'>Text Colors</h2>";
  renderColors(colors, container);
}

function backColors(backgroundColors) {
  const textColors = Array.from(
    document.getElementById("colors").querySelectorAll("span")
  ).map((el) => el.textContent);

  // remove duplicates
  const filteredBackgrounds = backgroundColors.filter(
    (color) => !textColors.includes(formatColor(color))
  );

  const container = document.getElementById("backcolors");
  container.innerHTML =
    "<h2 class='text-lg font-bold mb-2'>Background Colors</h2>";
  renderColors(filteredBackgrounds, container);
}

function renderColors(colors, container) {
  colors.forEach((color) => {
    const colorRow = document.createElement("div");
    colorRow.className = "flex items-center bg-white shadow p-2 rounded";

    const swatch = document.createElement("div");
    swatch.className = "w-8 h-8 rounded-lg border border-gray-400 mr-4";
    swatch.style.backgroundColor = color;
    swatch.title = color;

    const formattedColor = formatColor(color);

    const colorCode = document.createElement("span");
    colorCode.className = "text-base text-gray-900 select-all";
    colorCode.textContent = formattedColor;

    const flexSpacer = document.createElement("span");
    flexSpacer.className = "flex-1";

    const copyIcon = document.createElement("img");
    copyIcon.src = "copy-svg.svg";
    copyIcon.alt = "Copy";
    copyIcon.className = "ml-2 h-6 w-6 text-blue-500 cursor-pointer";
    copyIcon.addEventListener("click", () => {
      navigator.clipboard.writeText(formattedColor);
      alert(`Copied ${formattedColor} to clipboard`);
    });

    colorRow.appendChild(swatch);
    colorRow.appendChild(colorCode);
    colorRow.appendChild(flexSpacer);
    colorRow.appendChild(copyIcon);

    container.appendChild(colorRow);
  });
}

function formatColor(color) {
  const selectedFormat = formatSelect.value;

  try {
    const col = Color(color);
    switch (selectedFormat) {
      case "hex":
        return col.hex().toUpperCase();

      case "rgb":
        return col.rgb().string();

      case "hsl": {
        const hsl = col.hsl().object();
        const h = Math.round(hsl.h);
        const s = Math.round(hsl.s);
        const l = Math.round(hsl.l);
        return `hsl(${h}, ${s}%, ${l}%)`;
      }

      default:
        return color;
    }
  } catch (e) {
    console.log(`Failed to format color ${color}:`, e);
    return color;
  }
}


function generatePdf() {
  const doc = new jsPDF();
  let y = 20;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Extracted Colors", 15, y);
  y += 10;

  // Add Site URL
  const url = document.getElementById("urlInput")?.textContent || "No URL";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // Wrap URL if it's too long
  const splitUrl = doc.splitTextToSize(url, 180); // 180mm = fit A4 width
  doc.text("WebPage URL: " + splitUrl, 15, y);
  y += splitUrl.length * 5 + 5;

  const sections = [
    { id: "allColors", title: "All Colors" },
    { id: "colors", title: "Text Colors" },
    { id: "backcolors", title: "Background Colors" },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  sections.forEach((section) => {
    const container = document.getElementById(section.id);
    if (!container) return;

    const spans = container.querySelectorAll("span");
    if (!spans.length) return;

    // Section title
    doc.setFont("helvetica", "bold");
    doc.text(section.title, 15, y);
    y += 10;
    doc.setFont("helvetica", "normal");

    spans.forEach((span) => {
  const colorText = span.textContent?.trim();

  // Skip empty or non-color texts
  if (!colorText || colorText.toLowerCase().includes("not color")) {
    return;
  }

  try {
    // Convert to RGB for swatch
    let rgb;
    try {
      rgb = Color(colorText).rgb().array();
      doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    } catch (e) {
      try {
        doc.setFillColor(colorText);
      } catch (err) {
        doc.setFillColor(255, 255, 255);
      }
    }
    doc.setDrawColor(0); 
    doc.rect(15, y - 5, 8, 8, "FD");

    // Print the color code text
    doc.text(colorText, 30, y);
    y += 2;

  } catch (e) {
    console.warn("Skipping invalid color for PDF:", colorText, e);
    // Still write text (so user knows) but mark invalid
    doc.text(`${colorText} (invalid)`, 30, y);
  }

  y += 8;

  // Page break
  if (y > 280) {
    doc.addPage();
    y = 20;
  }
});


    y += 10;
  });

  const pageCount = doc.internal.getNumberOfPages();
  const timestamp = new Date().toLocaleString(); // local date + time

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(`Generated on: ${timestamp}`, 15, 290);
  }
  doc.save("extracted-colors.pdf");
}
