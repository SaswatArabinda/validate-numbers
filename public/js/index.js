let arrNumbers = [4, 5, 6, 10, 1, 11, 9, 2, 54, 0];
let input = document.querySelector('input');

const sortNumber = (a, b) => a - b;
document.getElementsByClassName("search-box__info")[0].innerHTML = `Existing numbers: ${arrNumbers.sort(sortNumber)}`;
// Convert array to json.
arrNumbers = arrNumbers.reduce((json, value) => { json[value] = true; return json; }, {});

document.getElementsByTagName('input')[0].addEventListener("blur", (event) => {
    let inputElement = event.target;
    inputElement.value != "" ? inputElement.classList.add("complete") : inputElement.classList.remove("complete");
});

// Handle escape
document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key == "Escape" || evt.key == "Esc");
    } else {
        isEscape = (evt.keyCode == 27);
    }
    if (isEscape) {
        let parentElement = document.getElementsByClassName("search-box__input")[0];
        parentElement.classList.contains("submitted") ? parentElement.classList.remove("submitted") : '';
    }
};

const handleInput = (event) => {
    let allow = false;

    let inputElement = event.target;
    let enteredString = inputElement.value;
    let enteredStringWithoutSpace = enteredString.split(" ").join("");
    let enteredChar = event.data ? event.data : '';
    let prevKeySelected = '';
    if (enteredChar == " ") {
        prevKeySelected = enteredString.charAt(enteredString.length - 2)
    } else {
        prevKeySelected = enteredStringWithoutSpace.charAt(enteredStringWithoutSpace.length - 2);
    }
    // let prevKeySelected = enteredChar == " " ? enteredString.charAt(enteredString.length - 2) : enteredString.trim().charAt(enteredString.length - 2);
    let isValidInput = /^\s*\d+(?:\s*-\s*\d+\s*)?(?:\s*,\s*\d+(?:\s*-\s*\d+)?)*\s*$/gm.test(enteredString);
    let isItRepeating = enteredString.split(",")[enteredString.split(",").length - 1].split(enteredChar).length - 1 < 2;



    // console.log({
    //     enteredString, enteredChar, prevKeySelected, isValidInput,
    // })
    // if (prevKeySelected != '' && x && (enteredChar == ' ' && prevKeySelected != ' '
    //     || enteredChar == ',' && prevKeySelected != ',' ||
    //     enteredChar == '-' && prevKeySelected != '-') || isValidInput) {
    //     // allow
    //     allow = true;
    // }
    // debugger;

    // To avoid repeating to special characters like ',', 'space', and '-' 
    let conditionOne = enteredChar == ' ' && prevKeySelected && prevKeySelected != ' ';
    let conditionTwo = enteredChar == ',' && prevKeySelected && prevKeySelected != ',';
    let conditionThree = enteredChar == '-' && prevKeySelected && prevKeySelected != '-';
    if ((conditionOne || conditionTwo || conditionThree) || isValidInput) {
        switch (enteredChar) {
            case '-':
                // To handle case line ",- 3"
                if (enteredStringWithoutSpace.charAt(enteredStringWithoutSpace.length - 2) == ',') {
                    allow = false;
                    break;
                }
            case ',':
            case ' ':
                allow = isItRepeating;
                break;
            default:
                allow = true;
        }
    }

    // If not allowed then clear it.
    if (!allow) {
        inputElement.value = enteredString.slice(0, enteredString.length - 1);
    }
}


const handleInputEvents = (event) => {
    let inputElement = event.target;
    let parentElement = document.getElementsByClassName("search-box__input")[0];
    const keyPressed = event.which ? event.which : event.keyCode;
    let userEntered = '', sortedArr = '', htmlForUniqueVal = '', htmlForDuplicateVal = '';
    // debugger;
    switch (keyPressed) {
        case 13:
            // debugger;

            userEntered = inputElement.value.split(",").filter((val) => val.trim() ? true : false).map((val) => {
                sortedArr = val.trim().split(" ").join('').split("-").sort(sortNumber);

                if (sortedArr.length > 1) {
                    sortedArr[0] = typeof sortedArr[0] == "string" && sortedArr[0].trim() == '' ? 0 : sortedArr[0];
                    sortedArr[1] = typeof sortedArr[1] == "string" && sortedArr[1].trim() == '' ? 0 : sortedArr[1];
                    return Array(parseInt(sortedArr[1]) - parseInt(sortedArr[0]) + 1).join(0).split(0).map((val, i) => { return i + parseInt(sortedArr[0]) });
                } else {
                    return val;
                }
            });
            if (userEntered.length < 1) {
                break;
            }
            userEntered = [...new Set(userEntered.join(",").split(",").map((val) => val && parseInt(val.trim())).sort(sortNumber))];
            // inputElement.value;

            userEntered.map((val) => {
                if (arrNumbers[val]) {
                    //duplicate values
                    htmlForDuplicateVal += `<span class="search-box__results--duplicate-val">${val}</span>`

                } else {
                    // unique values
                    htmlForUniqueVal += `<span class="search-box__results--unique-val">${val}</span>`
                }
            })

            document.getElementsByClassName("search-box__results--unique")[0].innerHTML = htmlForUniqueVal;
            document.getElementsByClassName("search-box__results--duplicate")[0].innerHTML = htmlForDuplicateVal;
            parentElement.classList.contains("submitted") ? parentElement.classList.remove("submitted") : parentElement.classList.add("submitted");
            break;
        default:
    }
}


input.oninput = handleInput;
input.addEventListener("keypress", handleInputEvents);

