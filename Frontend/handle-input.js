function screenShake(){
    return;
    body = $("body")
    body.addClass("shake")
    /*
    setTimeout(function(){
        body.removeClass("shake");
    },1000);
    */
}
function keyClickedAnimation(selectedKey){
    selectedKey.addClass("key-clicked");
        setTimeout(function(){
            selectedKey.removeClass("key-clicked");
        },1000);
    
    screenShake();

}
function handleEventAnimation(key){
    if(key=="Backspace"){key = "⌫";}
    $('.keyboard-row > div').each(function(){
        //console.log("hi");
        let button = $(this);
        if(button.text().toLowerCase()==key.toLowerCase()){
            keyClickedAnimation(button);
        }
    });


}
function setupKeyboardEvents(){
    $('.keyboard-row > div').on('click',function(){
        inputKey($(this).text());

        let selectedKey = $(this);
        keyClickedAnimation(selectedKey);
    });

}
function normalizeKeyForInputSource(key){
    if(key=="⌫"){key = "Backspace";}
    return key.toLowerCase();

}
function inputKey(key){
    key = normalizeKeyForInputSource(key);
    interpretInput(key);

}
$(document).ready(setupKeyboardEvents);
document.addEventListener('keydown', (key)=> {
    inputKey(key.key);
    handleEventAnimation(key.key);
}
    );