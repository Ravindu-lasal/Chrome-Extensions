import "./style.css";
import Color from "color";

const formatSelect = document.getElementById("format");

document.getElementById("extractColorsBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getColors" }, (response) => {
      if (response && response.colors && response.url && response.backgroundColors) {
        console.log("Colors extracted from URL:", response.url);
        console.log("Text Colors:", response.colors);
        console.log("Background Colors:", response.backgroundColors);
        displayColors(response.colors );
        backColors(response.backgroundColors);
        updateUrl(response.url);
      }
    });
  });
});

function updateUrl(url) {
  const urlInput = document.getElementById("urlInput");
  urlInput.textContent = url;
}

function displayColors(colors) {
  const container = document.getElementById("colors");
  container.innerHTML = "<h2 class='text-lg font-bold mb-2'>Text Colors</h2>";

  colors.forEach((color) => {
    const colorRow = document.createElement("div");
    colorRow.className = "flex items-center bg-white shadow p-2 rounded";

    const swatch = document.createElement("div");
    swatch.className = "w-8 h-8 rounded-lg border border-gray-400 mr-4";
    swatch.style.backgroundColor = color;
    swatch.title = color;

    //call function
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

function backColors(backgroundColors) {
  const container = document.getElementById("backcolors");
  container.innerHTML = "<h2 class='text-lg font-bold mb-2'>Background Colors</h2>";

  backgroundColors.forEach((color) => {
    const colorRow = document.createElement("div");
    colorRow.className = "flex items-center bg-white shadow p-2 rounded";

    const swatch = document.createElement("div");
    swatch.className = "w-8 h-8 rounded-lg border border-gray-400 mr-4";
    swatch.style.backgroundColor = color;
    swatch.title = color;

    //call function
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
    console.warn(`Failed to format color ${color}:`, e);
    return color;
  }
}
