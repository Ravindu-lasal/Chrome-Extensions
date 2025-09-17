function extractColors(){
    const elements = document.querySelectorAll('*');
    const colors = new Set();

    elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if(style.color) colors.add(style.color);
        if(style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            colors.add(style.backgroundColor);
        }
    });

    return Array.from(colors);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === 'getColors'){
        const colors = extractColors();
        sendResponse({colors: colors});
    }
});