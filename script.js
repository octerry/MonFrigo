// Coucou toi qui regarde dans le code
// 
// 
// /‾‾‾‾‾\ /‾‾‾‾‾] [‾‾‾‾‾‾‾‾] |‾‾‾‾‾] |‾‾‾‾‾\ |‾‾‾‾‾\ |‾| /‾/
// | |‾| | | |‾‾‾   ‾‾|  |‾‾  | |‾‾‾  |     | |     | | |/ /
// | | | | | |        |  |    |  ___] |     / |     / |  _/
// | |_| | | |___     |  |    | |___  | |\ \  | |\ \  | |
// \_____/ \_____]    |__|    |_____] |_| \_\ |_| \_\ |_|
// MADE ON EARTH BY HUMANS

let sections = document.querySelectorAll('.section');
let bigTab = [];
let passedSection = sections[0];
let passedTab = [];
let weekSection = sections[1];
let weekTab = [];
let laterSection = sections[2];
let laterTab = [];
let currentDate = new Date();
let daysByMonth = [31,28,31,30,31,30,31,31,30,31,30,31]

let addButton = document.getElementById('add_button');
let crossButtons = document.getElementsByClassName('close-cross');
let submitButton = document.getElementById('submit_button')

let editPopup = document.getElementById('edit_popup');
let errorPlace = document.getElementById('error_place')

let nameInput = document.getElementById('name_input');
let checkInput = document.getElementById('check_input');
let dateInput = document.getElementById('date_input');

addButton.addEventListener('click', function(){
    editPopup.style.animation = "popupAppear .5s forwards"
})

crossButtons[0].addEventListener('click', function() {
    editPopup.style.animation = "popupDisappear .5s forwards"
})

dateInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9/]/g, '');
    
    let place = 0;
    let tempTxt = ["",""]
    if (this.value.length === 3 && !this.value.includes("/")) {
        place = 2
    }

    if (this.value.length === 6 && this.value.charAt(5) != "/") {
        place = 5
    }
    
    if (this.value.length >= 10) {
        this.value = this.value.slice(0,10);
    }

    if (this.value.charAt(this.value.length - 1) == "/") {
        this.value = this.value.slice(0,this.value.length - 1);
    }

    if(place != 0) {
        tempTxt[0] = this.value.slice(0,place);
        tempTxt[1] = this.value.slice(place,this.value.length);
        this.value = tempTxt[0] + "/" + tempTxt[1];
    }
})

submitButton.addEventListener('click', function(){
    nameInput.classList.remove('error')
    dateInput.classList.remove('error')
    errorPlace.style.display = "none"
    errorPlace.children[0].innerHTML = ""

    if (nameInput.value.length === 0) {
        nameInput.classList.add('error')
        let errorElement = document.createElement('li');
        errorElement.appendChild(document.createTextNode("Vous ne pouvez pas donner un nom vide à votre aliment"));
        errorPlace.style.display = "block"
        errorPlace.children[0].appendChild(errorElement);
    }

    if (dateInput.value.length < 10) {
        dateInput.classList.add('error')
        let errorElement = document.createElement('li');
        errorElement.appendChild(document.createTextNode("La date entrée est invalide"));
        errorPlace.style.display = "block"
        errorPlace.children[0].appendChild(errorElement);
    } else {
        let dateInputTab = dateInput.value.split('/');
        let dayInput = parseInt(dateInputTab[0])
        let monthInput = parseInt(dateInputTab[1])
        let yearInput = parseInt(dateInputTab[2])

        if(dayInput <= 0 || monthInput <= 0) {
            dateInput.classList.add('error')
            let errorElement = document.createElement('li');
            errorElement.appendChild(document.createTextNode("La date entrée est invalide"));
            errorPlace.style.display = "block"
            errorPlace.children[0].appendChild(errorElement);
        } else {
            if(isPast([dayInput,monthInput,yearInput])) {
                dateInput.classList.add('error')
                let errorElement = document.createElement('li');
                errorElement.appendChild(document.createTextNode("La date entrée est déjà passée"));
                errorPlace.style.display = "block"
                errorPlace.children[0].appendChild(errorElement);
            }
        }
    }

    if(!nameInput.classList.contains("error") && !dateInput.classList.contains("error")) {
        let newDate = dateInput.value.split("/");        let dayInput = newDate[0];
        let day = newDate[0];
        let month = newDate[1];
        let year = newDate[2];

 
        let cellContent = {
            name: nameInput.value,
            preference: checkInput.checked,
            date: `${year}-${month}-${day}`,
            icon: 0, // -------------- A CHANGER !!!!! ------------------------
        }
        bigTab.push(cellContent)
        bigTab.sort((x, y) => dateStrToInt(x.date) - dateStrToInt(y.date))
        updateSmallTabs();
        nameInput.value = "";
        dateInput.value = "";
        editPopup.style.animation = "popupDisappear .5s forwards"
    }
})

window.addEventListener("keypress", function(event) { // CHEATCODE : µ pour ajouter pleins d'elements
    if(event.key === "µ") {
        for(let i=0; i<30; i++) {
            let cellContent = {
                name: rdmStr(rdm(20)),
                date: `2026-${rdm(12)}-${rdm(30)}`,
                preference: rdm(2) === 1,
                icon: rdm(10),
            }
            bigTab.push(cellContent)
        }
        console.log(dateStrToInt("2026-1-9"))
        bigTab.sort((x, y) => dateStrToInt(x.date) - dateStrToInt(y.date))
        updateSmallTabs()
    }
});

function updateSmallTabs() {
    sections[0].innerHTML = `<h2 class="section-title">Passés</h2>`;
    sections[1].innerHTML = `<h2 class="section-title">Cette semaine</h2>`;
    sections[2].innerHTML = `<h2 class="section-title">Plus tard</h2>`;

    for (const element of bigTab) {
        let dateTab = element.date.split('-')
        console.log(dateTab[2],dateTab[1],dateTab[0],isPast([dateTab[2],dateTab[1],dateTab[0]]))
        if(isPast([dateTab[2],dateTab[1],dateTab[0]])) {
            addToSection(element.name, element.date, 0);
        } else {
            if(isItWeek([dateTab[2],dateTab[1],dateTab[0]])) {
                addToSection(element.name, element.date, 1);
            } else {
                addToSection(element.name, element.date, 2);
            }
        }
    }
}

function addToSection(name, date, section) {
    let newDate = date.split('-')

    let newCell = document.createElement('div');
    let leftCell = document.createElement('div');
    let cellName = document.createElement('h1');
    let cellDate = document.createElement('h3');
    let cellIcon = document.createElement('img');

    cellName.innerText = name;
    cellDate.innerText = String(parseInt(newDate[2])).padStart(2, '0') + '/' + String(parseInt(newDate[1])).padStart(2, '0') + '/' + newDate[0];
    cellIcon.src = "source/foodCanIcon.svg"

    newCell.classList.add('cell');
    if(section === 0){ newCell.classList.add('dead') }
    leftCell.classList.add('left-cell')
    cellIcon.classList.add('cell-icon')
    
    leftCell.appendChild(cellName);
    leftCell.appendChild(cellDate);
    newCell.appendChild(leftCell);
    newCell.appendChild(cellIcon);
    sections[section].appendChild(newCell);
    //    <div class="left-cell">
    //        <h1>Nom produit</h1>
    //        <h3>xx/xx/xxxx</h3>
    //    </div>
    //    <img class="cell-icon" src="source/foodCanIcon.svg" alt="foodIcon">
        

}

function dateStrToInt(date) {
    let dateTab = date.split('-');
    let month = String(parseInt(dateTab[1])).padStart(2, '0');
    let day = String(parseInt(dateTab[2])).padStart(2, '0');
    let newDate = dateTab[0] + month + day
    return parseInt(newDate);
}

function rdmStr(len) {
    let final = "";
    for(let i=0; i<len; i++) {
        final += String.fromCharCode(rdm(120))
    }
    return final;
}

function rdm(max) {
    return Math.floor(Math.random() * max) + 1;
}

function isItWeek([dayInput, monthInput, yearInput]){
    dayInput = parseInt(dayInput)
    monthInput = parseInt(monthInput)
    yearInput = parseInt(yearInput)
    
    if(dayInput < 7) {
        if (monthInput === 1) {
            if(yearInput-1 === currentDate.getFullYear()) {
                return (31 + dayInput - 7) <= currentDate.getDate()
            }
        } else {
            if (monthInput-1 === currentDate.getMonth() && yearInput === currentDate.getFullYear()) {
                if(monthInput-1 != 2) {
                    return (daysByMonth[monthInput-1] + dayInput - 7) <= currentDate.date()
                } else { // RETOURNEZ BRULER EN ENFER LES ANNEES BISSEXTILES
                    if(yearInput%4) {
                        return (29 + dayInput - 7) <= currentDate.getDate()
                    } else {
                        return (28 + dayInput - 7) <= currentDate.getDate()
                    }
                }
            }
        }
    } else {
        if(monthInput === currentDate.getMonth() && yearInput === currentDate.getFullYear()) {
            return (dayInput - 7) <= currentDate.getDate()
        }
    }
    return false
}

function isPast([dayInput, monthInput, yearInput]) {
    dayInput = parseInt(dayInput)
    monthInput = parseInt(monthInput)
    yearInput = parseInt(yearInput)
    
    if(currentDate.getFullYear() === yearInput) {
        if(currentDate.getMonth() === monthInput) {
            if(currentDate.getDate() > dayInput) {
                return true
            }
        } else {
            if(currentDate.getMonth() > monthInput) {
                return true
            }
        }
    } else {
        if(currentDate.getFullYear() > yearInput) {
            return true    
        }
    }
    return false
} 

function sortByDate(tab) {
}