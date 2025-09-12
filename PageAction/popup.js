$(function(){
    
    $('#btnChange').click(function(){
        var color = $('#FontColor').val();

        console.log('Button clicked, color:', color); 
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            chrome.tabs.sendMessage(tabs[0].id,{todo:"changeColor",clicked_color: color});
        });
    })
})