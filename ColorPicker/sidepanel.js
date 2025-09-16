
document.getElementById('extractColorsBtn').addEventListener('click', () => {
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getColors'}, (response) => {
        if(response && response.colors){
            displayColors(response.colors);
        }
    });
});
});

function displayColors(colors){
    const container = document.getElementById('colors');
    container.innerHTML = '';
    colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = color;
        swatch.title = color;

        swatch.addEventListener('click', () => {
            navigator.clipboard.writeText(color);
            alert(`Copied ${color} to clipboard`)
        });
        container.appendChild(swatch);
    })
}