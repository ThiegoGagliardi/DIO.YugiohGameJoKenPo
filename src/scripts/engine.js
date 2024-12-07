const state ={
    score:{
        values:{
            playerScore: 0,
            computerScore: 0
        },
        view:{
            scoreBox: document.getElementById("score_points")
        },
    },
    cardSprites:{
        view:{
            avatar: document.getElementById("card-image"),
            name: document.getElementById("card-name"),
            type: document.getElementById("card-type"),
        },
        fieldCards:{
            view:{
                player: document.getElementById("player-field-card"),
                computer: document.getElementById("computer-field-card")
            }
        },
        playersCards:{
            view:{
                computer: document.getElementById("computer-cards"),
                player: document.getElementById("player-cards")
            }
        }       
    },
    actions:{
        button : document.getElementById("next-duel"),
        audioBgm : document.getElementById("bgm")
    }     
};

const pathImages = "./src/assets/icons/";

class Card {
    constructor (id, name, type, img, wins, loses)
    {
        this.id   = id,
        this.name = name,
        this.img  = `${pathImages}${img}`,
        this.type = type,
        this.wins = wins,
        this.loses = loses
    }
}

const paperWins = (type)=>{ return type === "rock"};
const rockWins = (type)=>{ return type === "scissors"};
const scissorsWins = (type)=>{ return type === "papper"};
const paperLoses = (type)=>{ return type === "scissors"};
const rockLoses = (type)=>{ return type === "papper"};
const scissorsLoses = (type)=>{ return type === "rock"};

const cardData=[
    
    new Card (0,"Blue Eyes White Dragon", "papper", "dragon.png",paperWins,paperLoses),
    new Card (1,"Dark Magician", "rock", "magician.png",rockWins,rockLoses),
    new Card (2,"Exodia", "scissors", "exodia.png", scissorsWins,scissorsLoses)    
]

async function getRandomCardId(){

    return Math.floor(Math.random() * cardData.length);    
}

async function createCardImage(randomIdCard, fieldSide){
        
    const img = document.createElement("img");

    img.setAttribute("height","100px");
    img.setAttribute("data-id",randomIdCard);
    img.classList.add("card");

    if (fieldSide === state.cardSprites.playersCards.view.computer){
        img.setAttribute("src", `${pathImages}card-back.png`); 
    }else{
        img.setAttribute("src",cardData[randomIdCard].img);
        img.addEventListener("click",()=>{ setCardsField(img.getAttribute("data-id"))});
        img.addEventListener("mouseover", () => { drawSelectCard(img.getAttribute("data-id")) });
    }  
    return img;
}

async function drawCards(cardNumbers, fieldSide){
    
    for (let i = 0; i < cardNumbers; i++){
        
        const randomIdCard = await getRandomCardId();       
        const cardImage    = await createCardImage(randomIdCard, fieldSide);
        
        fieldSide.appendChild(cardImage);        
    }
}

async function drawSelectCard(index){

    state.cardSprites.view.avatar.src     = cardData[index].img;
    state.cardSprites.view.name.innerText = cardData[index].name;
    state.cardSprites.view.type.innerText = "Attribute:" + cardData[index].type;
}

async function removeAllCardsImages(){

    let cards = state.cardSprites.playersCards.view.player;
    let imgElements = cards.querySelectorAll("img");

    imgElements.forEach((img) => img.remove());

    cards = state.cardSprites.playersCards.view.computer;
    imgElements = cards.querySelectorAll("img");

    imgElements.forEach((img) => img.remove());    
}

async function checkDuelResults(playerCardId, computerCardId){

    let duelResuts = "Empate";

    let playerCard = cardData[playerCardId];
    let computerCard = cardData[computerCardId];
    
    if (playerCard.wins(computerCard.type)){
        duelResuts = "Vitória";
        state.score.values.playerScore++;
        await playAudio("win");
    } else if (playerCard.loses(computerCard.type)){
        duelResuts = "Derrota";
        state.score.values.computerScore++;
        await playAudio("lose");
    }

    return duelResuts;
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore(){

   state.score.view.scoreBox.innerHTML = `Win: ${state.score.values.playerScore}`+
                                          `<br /> Lose: ${state.score.values.computerScore}`;
}

async function hiddenCardDetails(){

    state.cardSprites.view.name.innerText = "Selecione";
    state.cardSprites.view.type.innerText = "uma carta"; 
}

async function showFieldCards(show){

    if (show){
        state.cardSprites.fieldCards.view.computer.style.display = "block";
        state.cardSprites.fieldCards.view.player.style.display   = "block";
    } else {
        state.cardSprites.fieldCards.view.computer.style.display = "none";
        state.cardSprites.fieldCards.view.player.style.display   = "none";
    }
}

async function drawCardsInField(cardId, computerCardId){

    state.cardSprites.fieldCards.view.player.src = cardData[cardId].img;
    state.cardSprites.fieldCards.view.computer.src = cardData[computerCardId].img;    
}

async function setCardsField(cardId){    

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showFieldCards(true); 
    
    await hiddenCardDetails();    

    await drawCardsInField(cardId, computerCardId);    

    let duelResults = await checkDuelResults(cardId,computerCardId);   

    await updateScore();
    await drawButton(duelResults);
}

async function playAudio(status){

    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = 0.2;
    audio.play();
}

async function resetDuel(){

    state.cardSprites.view.avatar.src = "";
    state.actions.button.style.display = "none";  

    init();    
}

async function init(){    
    
    state.actions.audioBgm.volume = 0.2;
    state.actions.audioBgm.play();

    await showFieldCards(false);   

    await drawCards(5,state.cardSprites.playersCards.view.player);
    await drawCards(5,state.cardSprites.playersCards.view.computer);
}

init();