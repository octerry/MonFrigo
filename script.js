// Coucou toi qui regarde dans le code
// 
// 
// /‾‾‾‾‾\ /‾‾‾‾‾] [‾‾‾‾‾‾‾‾] |‾‾‾‾‾] |‾‾‾‾‾\ |‾‾‾‾‾\ |‾| /‾/
// | |‾| | | |‾‾‾   ‾‾|  |‾‾  | |‾‾‾  |     | |     | | |/ /
// | | | | | |        |  |    |  ___] |     / |     / |  _/
// | |_| | | |___     |  |    | |___  | |\ \  | |\ \  | |
// \_____/ \_____]    |__|    |_____] |_| \_\ |_| \_\ |_|
// MADE ON EARTH BY HUMANS

// Variables
let sections = document.querySelectorAll('.section');
let bigTab = [];
let passedSection = sections[0];
let weekSection = sections[1];
let laterSection = sections[2];
let currentDate = new Date();
let daysByMonth = [31,29,31,30,31,30,31,31,30,31,30,31]
let selected = null;
let selectedIcon = 20;
let darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Buttons
let addButton = document.getElementById('add_button');
let crossButtons = document.getElementsByClassName('close-cross');
let changeIconButton = document.getElementById('change_icon');
let submitButton = document.getElementById('submit_button');
let showDeleteButton = document.getElementById('show_delete');
let showEditButton = document.getElementById('show_edit');
let finalDeleteButton = document.getElementById('final_delete_button');
let iconButtons = document.getElementsByClassName('icon_button');
let settingsButton = document.getElementById('settings_button')

// Popups
let editPopup = document.getElementById('edit_popup');
let showPopup = document.getElementById('show_popup');
let deletePopup = document.getElementById('delete_popup');
let iconPopup = document.getElementById('icon_popup');
let settingsPopup = document.getElementById('settings_popup');
let blackScreen = document.getElementById('black_screen');
let tuto = document.getElementById('tuto');

// Outputs
let showName = document.getElementById('show_name');
let showDate = document.getElementById('show_date');
let showIcon = document.getElementById('show_icon');
let errorPlace = document.getElementById('error_place');
let deleteName = document.getElementById('delete_name');

// Inputs
let nameInput = document.getElementById('name_input');
let checkInput = document.getElementById('check_input');
let dateInput = document.getElementById('date_input');
let darkmodeInput = document.getElementById('darkmode_check').children[0]
darkmodeInput.checked = darkmode;
let deleteAllButton = document.getElementById('delete_all_button')

if(localStorage.getItem('bigTab')) {
    bigTab = JSON.parse(localStorage.getItem('bigTab'));
    updateSmallTabs();
}
if(localStorage.getItem('dark')) {
    darkmode = JSON.parse(localStorage.getItem('dark'));
    darkmodeInput.checked = darkmode;
    updateDarkmode();
}


settingsButton.addEventListener('click', function() {
    settingsPopup.style.animation = "popupAppear .5s forwards";
})

addButton.addEventListener('click', function(){
    editPopup.style.animation = "popupAppear .5s forwards";
    blackScreen.style.animation = "blackScreenAppear .5s forwards";
})

crossButtons[0].addEventListener('click', function() {
    editPopup.style.animation = "popupDisappear .5s forwards"
    blackScreen.style.animation = "blackScreenDisappear .5s forwards";
})

crossButtons[1].addEventListener('click', function() {
    showPopup.style.animation = "popupDisappear .5s forwards"
    blackScreen.style.animation = "blackScreenDisappear .5s forwards";
})

crossButtons[2].addEventListener('click', function() {
    deletePopup.style.animation = "popupDisappear .5s forwards";
})

crossButtons[3].addEventListener('click', function() {
    settingsPopup.style.animation = "popupDisappear .5s forwards"
})

showDeleteButton.addEventListener('click', function() {
    deleteName.innerHTML = bigTab[selected].name.substring(0,18) + "...";

    deletePopup.style.animation = "popupAppear .5s forwards";
})

finalDeleteButton.addEventListener('click', function() {
    bigTab.splice(selected, 1);
    updateSmallTabs()
    deletePopup.style.animation = "popupDisappear .5s forwards";
    showPopup.style.animation = "popupDisappear .5s forwards";
    blackScreen.style.animation = "blackScreenDisappear .5s forwards";
})

deleteAllButton.addEventListener('click', function() {
    bigTab = [];
    updateSmallTabs();
})

dateInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9/]/g, '');
    
    let place = 0;
    let tempTxt = ["",""]
    if (this.value.length === 3 && !this.value.includes("/")) {
        place = 2
        tempTxt[0] = this.value.slice(0,place);
        tempTxt[1] = this.value.slice(place,this.value.length);
        this.value = tempTxt[0] + "/" + tempTxt[1];
    }

    if (this.value.length === 6 && this.value.charAt(5) != "/") {
        place = 5
        tempTxt[0] = this.value.slice(0,place);
        tempTxt[1] = this.value.slice(place,this.value.length);
        this.value = tempTxt[0] + "/20" + tempTxt[1];
    }
    
    if (this.value.length >= 10) {
        this.value = this.value.slice(0,10);
    }

    if (this.value.charAt(this.value.length - 1) == "/") {
        this.value = this.value.slice(0,this.value.length - 1);
    }

    if(place != 0) {
    }
})

darkmodeInput.addEventListener('input', function() {
    darkmode = this.checked
    updateDarkmode()
    localStorage.setItem('dark', darkmode);
})

changeIconButton.addEventListener('click', function() {
    iconPopup.style.animation = "popupAppear .5s forwards"
})

submitButton.addEventListener('click', function() {
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

        if(dayInput <= 0 || dayInput > daysByMonth[monthInput] || monthInput <= 0 || monthInput > 12) {
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
            icon: selectedIcon, // -------------- A CHANGER !!!!! ------------------------
        }
        bigTab.push(cellContent)
        bigTab.sort((x, y) => dateStrToInt(x.date) - dateStrToInt(y.date))
        updateSmallTabs();
        nameInput.value = "";
        dateInput.value = "";
        editPopup.style.animation = "popupDisappear .5s forwards"
        blackScreen.style.animation = "blackScreenDisappear .5s forwards";
    }
})

for(let i=0; i<iconButtons.length; i++) {
    iconButtons[i].addEventListener('click', function() {
        selectedIcon = i+1;
        iconPopup.style.animation = "popupDisappear .5s forwards"
        changeIconButton.children[0].src = "source/icon" + selectedIcon + ".svg";
    })
}

// window.addEventListener("keypress", event => { // CHEATCODE : µ pour ajouter pleins d'elements
//     if(event.key === "µ") {
//         for(let i=0; i<30; i++) {
//             let cellContent = {
//                 name: rdmStr(rdm(20)),
//                 date: `2026-${rdm(12)}-${rdm(30)}`,
//                 preference: rdm(2) === 1,
//                 icon: rdm(10),
//             }
//             bigTab.push(cellContent)
//         }
//         bigTab.sort((x, y) => dateStrToInt(x.date) - dateStrToInt(y.date))
//         updateSmallTabs()
//     }
//     selected = 1;
//     updateShowPopup()
// });

window.addEventListener('click', event => {

})


function updateShowPopup() {
    let nameOutput = showName.children[1];
    let dateOutput = showDate.children[1];
    let iconOutput = showIcon.children[0];

    if(selected != null && selected < bigTab.length) {
        let selectedCell = bigTab[selected];
        let consomationText = "";
        let newDate = selectedCell.date.split('-');
        newDate = String(parseInt(newDate[2])).padStart(2, '0') + "/" + String(parseInt(newDate[1])).padStart(2, '0') + "/" + newDate[0]

        if (selectedCell.preference) {
            consomationText = "À consommer de préférence avant le "
        } else {
            consomationText = "À consommer avant le "
        }

        nameOutput.innerHTML = selectedCell.name;
        dateOutput.innerHTML = consomationText + newDate;
        iconOutput.src = "source/icon" + selectedCell.icon + ".svg";
    }
} 

function updateSmallTabs() {
    sections[0].innerHTML = `<h2 class="section-title">Passés</h2>`;
    sections[0].style.display = "none";
    sections[1].innerHTML = `<h2 class="section-title">Cette semaine</h2>`;
    sections[1].style.display = "none";
    sections[2].innerHTML = `<h2 class="section-title">Dans plus d'une semaine</h2>`;
    sections[2].style.display = "none";

    localStorage.setItem('bigTab', JSON.stringify(bigTab));

    for (const element of bigTab) {
        let dateTab = element.date.split('-')
        if(isPast([dateTab[2],dateTab[1],dateTab[0]])) {
            sections[0].style.display = "block";
            addToSection(0, element);
        } else {
            if(isItWeek([dateTab[2],dateTab[1],dateTab[0]])) {
                sections[1].style.display = "block";
                addToSection(1, element);
            } else {
                sections[2].style.display = "block";
                addToSection(2, element);
            }
        }
    }

    if(sections[0].style.display === "none" && sections[1].style.display === "none" && sections[2].style.display === "none") {
        tuto.style.display = "block";
    } else {
        tuto.style.display = "none";
    }
}

function addToSection(section, element) {
    let newDate = element.date.split('-')

    let newCell = document.createElement('div');
    let leftCell = document.createElement('div');
    let cellName = document.createElement('h1');
    let cellDate = document.createElement('h3');
    let cellIcon = document.createElement('img');

    if(element.name.length >= 20) {
        cellName.innerText = element.name.substring(0,18) + "...";
    } else {
        cellName.innerText = element.name;
    }
    cellDate.innerText = String(parseInt(newDate[2])).padStart(2, '0') + '/' + String(parseInt(newDate[1])).padStart(2, '0') + '/' + newDate[0];
    cellIcon.src = "source/icon" + element.icon + ".svg";

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
        
    newCell.addEventListener('click', function() {
        selected = bigTab.indexOf(element);
        updateShowPopup()

        showPopup.style.animation = "popupAppear .5s forwards"
        blackScreen.style.animation = "blackScreenAppear .5s forwards";
    })
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
            if (monthInput-1 === currentDate.getMonth()+1 && yearInput === currentDate.getFullYear()) {
                if(monthInput-1 != 2) {
                    return (daysByMonth[monthInput-1] + dayInput - 7) <= currentDate.getDate()
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
        if(monthInput === currentDate.getMonth()+1 && yearInput === currentDate.getFullYear()) {
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
        if(currentDate.getMonth()+1 === monthInput) {
            if(currentDate.getDate() > dayInput) {
                return true
            }
        } else {
            if(currentDate.getMonth()+1 > monthInput) {
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

function updateDarkmode() {
    let root = document.documentElement
    console.log(window.getComputedStyle(root).getPropertyValue('--bgColor'));

    if(darkmode) {
        root.classList.add('dark')
    } else {
        root.classList.remove('dark')
    }
}

updateDarkmode()