$(function(){
    
    var colorChange = $('#colorChange');

    $('#btnChange').click(function(){
        var color = $('#FontColor').val();
        colorChange.css('background-color', color);

        console.log('Button clicked, color:', color); 

        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            chrome.tabs.sendMessage(tabs[0].id,{
                todo:"changeColor",
                clicked_color: color});
        });
    })
})