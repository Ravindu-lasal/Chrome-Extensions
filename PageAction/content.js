chrome.runtime.sendMessage({ todo: "showPageAction" });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
    if (request.todo === "changeColor") {
        var addColor = request.clicked_color;
        console.log('Changing color to:', addColor);
        $('.devsite-page-title').css('color', addColor + ' !important');
    }
});
