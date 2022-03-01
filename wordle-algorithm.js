/*
Loading word lists.
*/
if(localStorage.getItem("mystery-words")==null){
    $.get("mystery_words.txt",(data)=>{
        localStorage.setItem("mystery-words",data);
    })
}
if(localStorage.getItem("guessable-words")==null){
    $.get("guessable_words.txt",(data)=>{
        //console.log("data:",data);
        localStorage.setItem("guessable-words",data);
    })
}
//console.log(localStorage.getItem("guessable-words"));
let wordPattern = /[A-Za-z]+/g;
function extractWords(storageLoc){
    let extracted = [...localStorage.getItem(storageLoc).matchAll(wordPattern)];
    return extracted.map(String);
}
const guessableWords = extractWords("guessable-words");
const mysteryWords = extractWords("mystery-words");
function isGuessable(word){
    word = word.toLowerCase();
    if(guessableWords.find(element => element==word)==undefined){
        return false;
    }
    return true;
}
const ColorCodes = {
    Green: "Green",
    Yellow: "Yellow",
    Gray: "Gray",
}
class YellowContext{
    constructor(){}
}
class Context{
    constructor(){
        this.remainingWords = [...mysteryWords]
        this.greenLetters = new Map();
        this.grayLetters = new Array();
        this.yellowLetters = new Map(); //Map(letter, Object{Count,NotAt:Array)
    }
    updatePossible(){
        
    }
    isPossible(word){
        word = word.toLowerCase();
        for(let i=0;i<5;i++){
            let loopLetter = word[i];
            //gray check
            if(this.grayLetters.includes(loopLetter)){
                return false;
            }
            //green check
            if(this.greenLetters.has(i)){
                if(this.greenLetters.get(i)!=loopLetter){
                    return false;
                }
            }
            //yellow not in check
            
            let notInPositions = this.yellowLetters.get(loopLetter);
            if(notInPositions){
                if(notInPositions.includes(i)){return false;}
            }
        }
        //each yellow is in word.
        for(elem in this.yellowLetters.keys()){
            if(!word.includes(elem)){
                return false;
            }
        }
        return true;
    }
    makeGuess(word,mystery){
        for(let i=0;i<word.length;i++){
            let wordL = word[i];
            let mystL = mystery[i];
            if(wordL==mystL){
                this.greenLetters.set(i, wordL);
            }
            else if(mystery.includes(wordL)){
                let arr = this.yellowLetters.get(wordL);
                if(arr==undefined) {arr = [];}
                if(!arr.includes(wordL)){
                    arr.push(wordL);
                }
                this.yellowLetters.set(wordL, arr);
            }
            else{
                this.grayLetters.push(wordL);
            }
        }

    }
    colorCode(word){
        let result = []
        
        for(let i=0;i<word.length;i++){
            let letter = word[i];
            if(this.greenLetters.get(i)==letter){
                result.push(ColorCodes.Green);
            }
            else if(this.yellowLetters.get(letter)!=undefined){
                result.push(ColorCodes.Yellow);
            }
            else if(this.grayLetters.includes(letter)){
                result.push(ColorCodes.Gray);
            }
            else{
                console.log(this.greenLetters);
                throw new Error("There's something strange -- on letter: "+i)
            }
        }
        return result;
    }
    keyColor(letter){
        letter = letter.toLowerCase();
        if(this.grayLetters.includes(letter)) return ColorCodes.Gray;
        if([...this.greenLetters.values()].includes(letter)) return ColorCodes.Green;
        if(this.yellowLetters.get(letter)!=undefined) return ColorCodes.Yellow;
        return null;
    }

}
function grabRandomMysteryWord(){
    let index = Math.floor(Math.random()*(mysteryWords.length-1));
    return mysteryWords[index];
}
let mysteryWord = grabRandomMysteryWord();
let GameContext = new Context();