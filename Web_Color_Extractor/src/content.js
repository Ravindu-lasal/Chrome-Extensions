function getBrowserUrl() {
    return window.location.href;

}

function extractColors(){
    const elements = document.querySelectorAll('*');
    const colors = new Set();
    const backgroundColors = new Set();

    elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.color) colors.add(style.color);
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            backgroundColors.add(style.backgroundColor);
        }
    });

    return{
        colors: Array.from(colors),
        backgroundColors: Array.from(backgroundColors)
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === 'getColors'){
        const {colors, backgroundColors} = extractColors();
        const url = getBrowserUrl();
        sendResponse({
            colors: colors,
            url: url,
            backgroundColors: backgroundColors
        });
    }
});