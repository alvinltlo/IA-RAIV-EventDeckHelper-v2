//deck
var drew_card;
var evt_deck = [], evt_drew_deck = [];
var evt_t1 = [], evt_t2 = [], evt_t3 = [], evt_rebelAid = [], evt_agenda = [];

//constant
const evt_file_path = "images\\events";
const evt_file_prefix = "Imperial Assault - RAIVER - Events";
const evt_rebelAid_file_prefix = "Imperial Assault - RAIVER - Rebel Aid";
const evt_agenda_file_prefix = "Imperial Assault - RAIVER - Imperial Agenda";
const start_standard_evt_deck_size = 25;

const difficultyM = new Map();
difficultyM.set("Standard", [-1, -1, -1]);
//difficultyM.set("Standard", [1, 1, 1]);
difficultyM.set("Youngling", [20, 5, 0]);
difficultyM.set("Padawan", [13, 12, 0]);
difficultyM.set("Jedi Knight", [8, 9, 8]);
difficultyM.set("Jedi Master", [0, 10, 15]);
difficultyM.set("Yoda", [0, 5, 20]);

$(document).ready(function () {
    loadResource();
    $('.dropdown-menu a').click(function () {
        $('#difficultyDropdownMenu').text($(this).text());
        buildDeckBtn.disabled = false;
    });
    $('body').on('click', '#speicalCardArea img', function () {

        if (this.classList.contains("selected"))
            this.classList.remove("selected")
        else
            this.classList.add("selected")

        var selectedCards = document.getElementsByClassName("selected");

        if (selectedCards.length === 0)
            discardSCardBtn.disabled = true;
        else
            discardSCardBtn.disabled = false;
    });
});

function discardSCard() {
    var selectedCards = document.getElementsByClassName("selected");
    selectedCards = [].slice.call(selectedCards);
    selectedCards.forEach(function (card) {
        card.parentNode.removeChild(card);
    })
    discardSCardBtn.disabled = true;
}

function discardSGCard(e) {
    console.log(e);
    var selectedCards = document.getElementsByClassName("selected");
    selectedCards = [].slice.call(selectedCards);
    selectedCards.forEach(function (card) {
        card.parentNode.removeChild(card);
    })
    discardSGCardBtn.disabled = true;
}

function loadResource() {
    evt_deck = []
    evt_drew_deck = []

    $.getJSON("data\\events.json", function (data) {
        evt_t1 = data.filter(function (event) {
            return event.tier == 1;
        });
        evt_t2 = data.filter(function (event) {
            return event.tier == 2;
        });
        evt_t3 = data.filter(function (event) {
            return event.tier == 3;
        });
    });

    $.getJSON("data\\rebelAid.json", function (data) {
        evt_rebelAid = data;
    });

    $.getJSON("data\\agenda.json", function (data) {
        evt_agenda = data;
    });
}

function buildDeck() {
    loadResource();
    if (difficultyDropdownMenu.textContent === "All Events") {
        //evt_deck = [].concat(evt_t1, evt_t2, evt_t3);
        for (let i = 0; i < evt_t1.length; i++) {
            evt = evt_t1[i];
            evt_deck.push(evt);
        }
        for (let i = 0; i < evt_t2.length; i++) {
            evt = evt_t2[i];
            evt_deck.push(evt);
        }
        for (let i = 0; i < evt_t3.length; i++) {
            evt = evt_t3[i];
            evt_deck.push(evt);
        }
    }
    else {
        difficulty_level_arr = difficultyM.get(difficultyDropdownMenu.textContent);

        num_t1 = difficulty_level_arr[0];
        num_t2 = difficulty_level_arr[1];
        num_t3 = difficulty_level_arr[2];

        console.log("Building " + num_t1 + "," + num_t2 + "," + num_t3);

        if (num_t1 == -1) {
            //standard (variable/unpredictable difficult) need speical handle d_v_standard
            for (let i = 0; i < start_standard_evt_deck_size; i++) {
                let _t = getRandomIntInclusive(1, 3);
                if (_t == 1)
                    evt = evt_t1.splice(evt_t1.length * Math.random() | 0, 1)[0];
                else if (_t == 2)
                    evt = evt_t2.splice(evt_t2.length * Math.random() | 0, 1)[0];
                else
                    evt = evt_t3.splice(evt_t3.length * Math.random() | 0, 1)[0];
                evt_deck.push(evt);
            }
        }
        else {
            for (let i = 0; i < num_t1; i++) {
                evt = evt_t1.splice(evt_t1.length * Math.random() | 0, 1)[0];
                evt_deck.push(evt);
            }
            for (let i = 0; i < num_t2; i++) {
                evt = evt_t2.splice(evt_t2.length * Math.random() | 0, 1)[0];
                evt_deck.push(evt);
            }
            for (let i = 0; i < num_t3; i++) {
                evt = evt_t3.splice(evt_t3.length * Math.random() | 0, 1)[0];
                evt_deck.push(evt);
            }
        }
    }
    //reset
    eventDeckSize.textContent = evt_deck.length;
    drewEventDeckSize.textContent = evt_drew_deck.length;

    drawEventBtn.disabled = false;
    eventDeckBtn.disabled = false;
    drewEventDeckBtn.disabled = false;
    instandCardArea.innerHTML = '';
    standardCardArea.innerHTML = '';
    speicalCardArea.innerHTML = '';
    addAgendaBtn.disabled = false;
    addRebelAidBtn.disabled = false;
    saveDeckBtn.disabled = false;
    twoGlobalEventBtn.disabled = false;
}

function drawEvent() {
    drew_card = evt_deck.splice(evt_deck.length * Math.random() | 0, 1)[0];
    console.log(drew_card);

    switch (drew_card.set) {
        case "Standard":
            img_path = evt_file_path + "\\tier" + drew_card.tier + "\\" + evt_file_prefix +
                drew_card.id + ".jpg";
            break;
        case "RebelAid":
            img_path = evt_file_path + "\\rebelAid" + "\\" + evt_rebelAid_file_prefix +
                drew_card.id + ".jpg";
            break;
        case "Agenda":
            img_path = evt_file_path + "\\agenda" + "\\" + evt_agenda_file_prefix +
                drew_card.id + ".jpg";
            break;
        default:
    }

    let img = document.createElement("img");
    img.src = img_path;
    img.classList.add("animated", "flipInY", "mx-auto", "img-fluid", "d-block", "card");

    if (drew_card.type === "Global" && (drew_card.set === "RebelAid" || drew_card.set === "Agenda")) {
        dest = speicalCardArea;
        dest.appendChild(img);
    } else {
        if (drew_card.type === "Instant") {
            dest = instandCardArea;
            dest.innerHTML = '';
            dest.appendChild(img);
        }
        else {
            dest = standardCardArea;
            if (twoGlobalEventBtn.textContent.trim() == "Enable 2 Standard Global Event")
                dest.innerHTML = '';
            dest.appendChild(img);
        }
    }

    evt_drew_deck.push(drew_card);

    //update deck counter
    eventDeckSize.textContent = evt_deck.length;
    drewEventDeckSize.textContent = evt_drew_deck.length;

    if (evt_deck.length == 0)
        drawEventBtn.disabled = true;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function addRebelAidCard() {
    let evt = evt_rebelAid.splice(evt_rebelAid.length * Math.random() | 0, 1)[0];
    evt_deck.push(evt);
    eventDeckSize.textContent = evt_deck.length;
}

function addAgendaCard() {
    let evt = evt_agenda.splice(evt_agenda.length * Math.random() | 0, 1)[0];
    evt_deck.push(evt);
    eventDeckSize.textContent = evt_deck.length;
}

function viewEventDeck() {
    viewDeck("Event Deck", evt_deck);
}

function viewDrewEventDeck() {
    viewDeck("Drew Event Deck", evt_drew_deck);
}

function viewDeck(title, deck) {
    eventModalTable.innerHTML = '';
    eventModalHeader.textContent = title + " (Deck Size=" + deck.length + ")";

    for (i = 0; i < deck.length; i++) {
        tier = "";
        img_path = "";

        if (deck[i].set === "Standard") {
            tier = deck[i].tier;
            img_path = evt_file_path + "\\tier" + tier + "\\" + evt_file_prefix +
                deck[i].id + ".jpg";
        }
        else if (deck[i].set === "RebelAid") {
            img_path = evt_file_path + "\\rebelAid\\" + evt_rebelAid_file_prefix +
                deck[i].id + ".jpg";
        }
        else {
            img_path = evt_file_path + "\\agenda\\" + evt_agenda_file_prefix +
                deck[i].id + ".jpg";
        }
        name = '<a href="#" onclick="showImage(this)">' + deck[i].name + '<div><img class="modal_card" src="' + img_path + '" style="display: none;"/></div></a>';
        addRow(eventModalTable, name, deck[i].set, deck[i].type, tier);
    }
}

function showImage(e) {
    imgStyle = e.querySelector('.modal_card').style.display;
    if (imgStyle === "none")
        e.querySelector('.modal_card').style.display = "block";
    else
        e.querySelector('.modal_card').style.display = "none";
}

function addCell(tr, val) {
    let td = document.createElement('td');
    td.innerHTML = val;
    tr.appendChild(td)
}

function addRow(tbl, val_1, val_2, val_3, val_4) {
    let tr = document.createElement('tr');
    addCell(tr, val_1);
    addCell(tr, val_2);
    addCell(tr, val_3);
    addCell(tr, val_4);
    tbl.appendChild(tr)
}

function saveDeck() {
    var content = JSON.stringify(evt_deck, null, 2);
    var blob = new Blob([content], {
        type: "text/plain;charset=utf-16"
    });
    saveAs(blob, "events.json");
}

function loadDeck(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
        evt_deck = JSON.parse(reader.result);

        eventDeckSize.innerHTML = evt_deck.length;
        drewEventDeckSize.innerHTML = evt_drew_deck.length;
        drawEventBtn.disabled = false;
        eventDeckBtn.disabled = false;
        drewEventDeckBtn.disabled = false;
        instandCardArea.innerHTML = '';
        standardCardArea.innerHTML = '';
        speicalCardArea.innerHTML = '';
        addRebelAidBtn.disabled = false;
        addAgendaBtn.disabled = false;
        saveDeckBtn.disabled = false;
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}

function toggle2GlobalEvent() {
    if (twoGlobalEventBtn.textContent.trim() == "Enable 2 Standard Global Event") {
        standardCardArea.classList.add("selectable");
        twoGlobalEventBtn.textContent = "Disable 2 Standard Global Event";
        $('body').on('click', '#standardCardArea img', function () {

            if (this.classList.contains("selected"))
                this.classList.remove("selected")
            else
                this.classList.add("selected")

            console.log(selectedCards);
            var selectedCards = document.getElementsByClassName("selected");

            if (selectedCards.length === 0)
                discardSGCardBtn.disabled = true;
            else
                discardSGCardBtn.disabled = false;
        });
    } else {
        standardCardArea.classList.remove("selectable");
        twoGlobalEventBtn.textContent = "Enable 2 Standard Global Event";
        $('body').on('click', '#standardCardArea img', function () { });
    }
}
