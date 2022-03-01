let workingRow = 0;
let waitingForInput = true;

const shaking = function () {
    let arr = []
    for (let i = 0; i < 6; i++) {
        arr[i] = false;
    }
    return arr;
}();
function sleepFor(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}
class RowRepr {
    constructor(rowIndex) {
        this.rowIndex = rowIndex;
        this.text = undefined;
    }
    getContent() {
        this.text = "";
        for (let i = 0; i < 5; i++) {
            let selector = `#grid-item-${i}-${this.rowIndex}`;
            this.text += $(selector).text();
        }
        return this.text;
    }
    setContent(str) {
        this.text = str.substring(0, Math.min(5, str.length));
    }
    startShake() {
        if (shaking[this.rowIndex]) {
            return;
        }
        shaking[this.rowIndex] = true;
        this.selection.forEach(selected => {
            selected.addClass("shake");
        });
        //this.stopShake();
        const that = this;
        setTimeout(() => { that.stopShake() }, 1000);

    }
    stopShake() {
        this.selection.forEach((selected) => {
            selected.removeClass("shake");
        });
        shaking[this.rowIndex] = false;
    }
    shakeEffect() {
        this.selection = []
        for (let i = 0; i < 5; i++) {
            let selector = `#grid-item-${i}-${this.rowIndex}`;
            this.selection.push($(selector));
        }
        this.startShake();
    }

    blit() {
        var i;
        for (i = 0; i < this.text.length; i++) {
            let selector = `#grid-item-${i}-${this.rowIndex}`;
            $(selector).text(this.text[i]);
        }
        for (let i2 = i; i2 < 5; i2++) {

            let selector = `#grid-item-${i2}-${this.rowIndex}`;
            $(selector).text("");
        }
    }
    colorCode() {
        const codes = GameContext.colorCode(this.getContent());
        let selection = [];
        for (let i = 0; i < this.text.length; i++) {
            let selector = `#grid-item-${i}-${this.rowIndex}`;
            var addedClass;
            switch (codes[i]) {
                case ColorCodes.Green:
                    addedClass = "green-letter";
                    break
                case ColorCodes.Yellow:
                    addedClass = "yellow-letter";
                    break;
                case ColorCodes.Gray:
                    addedClass = "gray-letter";
                    break;

            }
            selection.push({sel:selector,color:addedClass});
        }
        let operation = async function() {
            for(let i=0;i<selection.length;i++){
                var pack = selection[i];
                var selector = pack.sel;
                var addedClass = pack.color;
                $(selector).addClass(addedClass);
                await sleepFor(200);
            }
        }
        setTimeout(operation, 0);


    }
}
function getCurrentRowRepr() {
    return new RowRepr(workingRow);
}
function deleteInput() {
    let row = getCurrentRowRepr();
    if (row.getContent().length == 0) { return; }
    row.setContent(row.getContent().substring(0, row.getContent().length - 1));
    row.blit();
}
const errorMessageDuration = 1000;
function errorMsg(id) {
    if ($(id).css('visibility') == "visible") return;
    $(id).css("visibility", "visible");
    setTimeout(function () {
        $(id).css("visibility", "hidden");
    }, errorMessageDuration);
}
function updateKeyColors() {
    $(".keyboard-row > div").each(
        function () {
            let key = $(this).text();
            let color = GameContext.keyColor(key);
            if (color == null) return;
            var newClass;
            $(this).removeClass("green-letter yellow-letter gray-letter");
            switch (color) {
                case ColorCodes.Green:
                    newClass = "green-letter";
                    break;
                case ColorCodes.Yellow:
                    newClass = "yellow-letter";
                    break;
                case ColorCodes.Gray:
                    newClass = "gray-letter";
                    break;
                default:
                    throw Error("The demon barber strikes again!");


            }
            $(this).addClass(newClass);
        }
    );
}
function submitInput() {
    let row = getCurrentRowRepr();
    if (row.getContent().length != 5) {
        row.shakeEffect();
        errorMsg("#not-enough-letters");
        return;
    }
    if (!isGuessable(row.getContent())) {
        row.shakeEffect();
        errorMsg("#not-a-word");
        return;
    }
    GameContext.makeGuess(row.getContent(), mysteryWord);
    row.colorCode();
    updateKeyColors();
    workingRow++;

}
function addInput(key) {
    let row = getCurrentRowRepr();
    if (row.getContent().length == 5) { return; }
    row.setContent(row.getContent() + key);
    row.blit();
}


function interpretInput(key) {
    if (key == "enter") { submitInput(); }
    else if (key == "backspace") { deleteInput(); }
    else {
        if (/[^a-zA-Z]/.test(key)) { return; }
        if (key.length != 1) { return; }
        addInput(key);
    }

}