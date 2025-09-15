chrome.runtime.sendMessage({ todo: "showPageAction" });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.todo === "changeColor") {
        const addColor = request.clicked_color;
        console.log('Changing all h1 tags to:', addColor);

        document.querySelectorAll('h1').forEach(el => {
            el.style.setProperty('color', addColor, 'important');
        });
    }
});


