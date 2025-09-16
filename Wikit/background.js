var menuitem = {
  "id": "wikit-search",
  "title": "Search Wikipedia for '%s'",
  "contexts": ["selection"]
};

chrome.contextMenus.create(menuitem);

function fixedEncodeURI (str) {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%2C/g, ',');
}

chrome.contextMenus.onClicked.addListener(function(clickData){
    if(clickData.menuItemId == "wikit-search" && clickData.selectionText){
        var url = "https://en.wikipedia.org/wiki/" + fixedEncodeURI(clickData.selectionText);

        // Get display info
        chrome.system.display.getInfo(function(displays) {
            // Usually first display is the primary monitor
            let display = displays[0].workArea;

            var createData = {
                url: url,
                type: "popup",
                top: 5,
                left: 5,
                width: Math.floor(display.width / 1.5),
                height: Math.floor(display.height / 1.5)
            };

            chrome.windows.create(createData);
        });
    }
});