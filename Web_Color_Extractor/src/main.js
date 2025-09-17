import './style.css'

document.getElementById('extractColorsBtn').addEventListener('click', () => {
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getColors'}, (response) => {
        if(response && response.colors){
            displayColors(response.colors);
        }
    });
});
});

function displayColors(colors) {
    const container = document.getElementById('colors');
    container.innerHTML = ''; 

    colors.forEach(color => {
        const colorRow = document.createElement('div');
        colorRow.className = 'flex items-center bg-white shadow p-2 rounded';

        const swatch = document.createElement('div');
        swatch.className = 'w-8 h-8 rounded-lg border border-gray-400 mr-4';
        swatch.style.backgroundColor = color;
        swatch.title = color;

        const colorCode = document.createElement('span');
        colorCode.className = 'text-base text-gray-900 select-all';
        colorCode.textContent = color;

        const flexSpacer = document.createElement('span');
        flexSpacer.className = 'flex-1';

        const copyIcon = document.createElement('img');
        copyIcon.src = 'copy-svg.svg';
        copyIcon.alt = 'Copy';
        copyIcon.className = 'ml-2 h-6 w-6 text-blue-500 cursor-pointer';
        copyIcon.addEventListener('click', () => {
            navigator.clipboard.writeText(color);
            alert(`Copied ${color} to clipboard`);
        });

       
        colorRow.appendChild(swatch);
        colorRow.appendChild(colorCode);
        colorRow.appendChild(flexSpacer);
        colorRow.appendChild(copyIcon);

        container.appendChild(colorRow);
    });
}
