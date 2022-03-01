function keyboardLetters() {
    return [...Array(26).keys()].map((digit) => String.fromCharCode(digit + 65));
}
function makeGrid() {
    function makeGridItem(x, y) {
        return `<div class="grid-item" id="grid-item-${x}-${y}"></div>`
    }
    const grid = $("#grid")
    for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 5; x++) {
        
            grid.append(makeGridItem(x,y));
        
    }
}
    
}
$(document).ready(makeGrid);