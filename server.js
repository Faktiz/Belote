function DeepCopy(obj){
	return JSON.parse(JSON.stringify(obj));
}

function shuffleArray(array) {
    let len = array.length,
        currentIndex;
    for (currentIndex = len - 1; currentIndex > 0; currentIndex--) {
        let randIndex = Math.floor(Math.random() * (currentIndex + 1) );
        var temp = array[currentIndex];
        array[currentIndex] = array[randIndex];
        array[randIndex] = temp;
    }
}
// 4 joueurs connecté NORD SUD EST OUEST
// distribue 8 cartes sur 32 tirés au sort

//juste on clique sur la carte en fait..

//comptage points en direct tableau points
//vainqueur du pli 

//des qu'on a fait un tour complet (posPli.n != undefined) on choisi le gagnant on emit le pli et on remet posPli.n= ''

//=> quand fait meme principe que shiftFam Tableau player vide => validation pli 
//PUIS quand 8 pli => 1sec +tard nouvelle donne

const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
//const { prependListener } = require('process');
const server = http.createServer(app)

const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

function DeepCopy(obj){
	return JSON.parse(JSON.stringify(obj));
}

function shuffleArray(array) {
    let len = array.length,
        currentIndex;
    for (currentIndex = len - 1; currentIndex > 0; currentIndex--) {
        let randIndex = Math.floor(Math.random() * (currentIndex + 1) );
        var temp = array[currentIndex];
        array[currentIndex] = array[randIndex];
        array[randIndex] = temp;
    }
}

class Player{
	constructor(name){
		this.name = name;
		this.hand = [];
		this.team = '';//A || B
	}
	
}
class Deal{
	// Nouveau tour de jeu composé de 8 round
	constructor() {
		debugger
		this.deck = DeepCopy(templateDeck);
		this.shuffleDeck();	
		this.giveCards();
	}
	
	shuffleDeck(){
		shuffleArray(this.deck);
	}
	
	giveCards(){
		let _deck = this.deck;
		game.players.forEach(function(player){
			for(let i = 0; i<nbRound ; i++)
			{
				player.hand.push(_deck.shift());
			}
		});
	}
	
}

class Round{
	constructor(dealer){
		
	}

	
}

class Card{
	constructor(color,value){
		this.color = color;
		this.value = value;
	}
	
}

class Game{
	constructor(players,pointsFinished ) {
		this.scoreTeamA = 0;
		this.scoreTeamB = 0;
		this.pointsFinished = pointsFinished;
		this.finished = false;
		this.players = players;
		this.dealer = Math.floor(Math.random() * this.players.length);
		this.createDeck();
		console.warn("Dealer is",this.players[this.dealer].name);
	}

	isFinished() {
		this.finished = scoreTeamA > this.pointsFinished || scoreTeamB > this.pointsFinished;
		if(this.finished)
			this.endGame;
	}
	
	createDeck(){
		for(let i = 0; i < colors.length ; i++)
		{
			for(let j = 0; j < values.length ; j++)
			{
				let _card = new Card(colors[i],values[j]);
				templateDeck.push(_card);
			}
		}
	}
	
	endGame(){
		console.error("Game has ended Team", (scoreTeamA > scoreTeamB ? "Team A":"Team B"),"has won");
	}
	
	
}

const fakePlayers = [];
for(let i =0 ; i < 4; i++){
	let _player = new Player('J'+i);
	fakePlayers.push(_player);
}
// CLUB DIAMONDS SPADE HEART GAME ->
const templateDeck = [];
const language = 'FR';
const cLanguage = 'c_'+language;
const vLanguage = 'v_'+language;
const nbRound = 8; //Also number of cards in hand
var colors = [
	{c_FR:'Pi',c_EN:'S',color_EN:'Spade',color_FR:'Pique'},
	{c_FR:'Co',c_EN:'H',color_EN:'Heart',color_FR:'Coeur'},
	{c_FR:'Ca',c_EN:'D',color_EN:'Diamonds',color_FR:'Carreau'},
	{c_FR:'Tr',c_EN:'C',color_EN:'Club',color_FR:'Trefle'}
];

colors.forEach(color => color.c = color[cLanguage]);

var values = [
	{name_EN:'Ace',name_FR:'As',v_FR:'As',v_EN:'Ac'},
	{name_EN:'Ten',name_FR:'Dix',v_FR:'Di',v_EN:'Te'},
	{name_EN:'King',name_FR:'Roi',v_FR:'Ro',v_EN:'Ki'},
	{name_EN:'Queen',name_FR:'Dame',v_FR:'Da',v_EN:'Qu'},
	{name_EN:'Jack',name_FR:'Valet',v_FR:'Va',v_EN:'Ja'},
	{name_EN:'Nine',name_FR:'Neuf',v_FR:'Ne',v_EN:'Ni'},
	{name_EN:'Eight',name_FR:'Huit',v_FR:'Hu',v_EN:'Ei'},
	{name_EN:'Seven',name_FR:'Sept',v_FR:'Se',v_EN:'Se'}
];

values.forEach(value => value.v = value[vLanguage]);
var game = new Game(fakePlayers,10);


io.on('connect', (socket) => {
    console.log(socket.id + ' vient de se connecter'); //on lui envoi ses cartes lors de sa connection pour eviter bug ? si croisés ?
    shiftFam(socket.id)      
    sendClient()  

    socket.on('draw', () => { //clear le undefined
        if (coPlayer.length==0) {
            draw(cards)
        }
        else {io.to(socket.id).emit('erreur','vous etes pas 4')}
    })

    socket.on('mise',(mise)=>{
        atout=mise.atout
        contrat=mise.contrat
        
        if (idToPos(socket.id)==aQui()) {
            console.log(contrat,atout,idToPos(socket.id));
            suivant()
            io.emit('aQui',aQui())
        }
        else { io.emit('aQui',aQui())}
    })
    /*
    socket.on('pli', () => {     // a supprimer optimiser   
        ord(socket.id)
    })*/
    socket.on('suivant', () => {     //a activer des que le mec a joué sa carte !
        suivant()
        io.emit('aQui',aQui())
    })

    socket.on('selectCard', (card) => {     // ERREUR s'envoi en plusieurs fois en fonction des draw ?????????????????????????????????????????????????????????????????????????????????   
        
        if (idToPos(socket.id)==aQui()) {
            posPli[idToPos(socket.id)]=convert(card,atout)

            console.log(posPli);  
            console.log(idToPos(socket.id) +' a choisi sa carte')
         

            let i=players[idToPos(socket.id)[0]].indexOf(card)
            players[idToPos(socket.id)[0]].splice(i,1)

            suivant() 
            io.to(players[idToPos(socket.id)]).emit('refresh',players[idToPos(socket.id)[0]])
            io.emit('aQui',aQui())
            verifPli()
        }
        else { io.emit('aQui',aQui())}

        //on envoi une popup au joueur lui dire de choisir une carte
        //des que le mec a joué sa carte ca sauvegarde et on attend la carte du suivant !! VALIDATION necessaire tant que c'est pas a lui de jouer a boucler
        
     })
     socket.on('disconnect',()=>{
        console.log(socket.id+ "user disconnect")
        unshiftFam(socket.id)
    })
})

server.listen(port, () => {
    console.log('Application lancée sur le port '+port);
})
/*---------DEAL---------- */
/*-----VAR--------*/
var coPlayer=["nord","est","sud","ouest"]
const ordre=["nord","est","sud","ouest","nord","est","sud"] 
let boucleCount=0 // ordre[boucleCount] de jouer if bouclecount>+ => =0 
var atout;
var contrat;
var histoPoints=0
var histoPli=[]
var players={
    "nord":'id',
    "sud":'id',
    "est":'id',
    "ouest":'id',
    "n":[],
    "s":[],
    "e":[],
    "o":[]
}
var posPli={
    'nord':'',
    'est':'',
    'sud':'',
    'ouest':'',
}

let save=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
let cards=save

function draw(array){
    //envoi 8 cartes a 4 joueurs
    players.n=[]
    players.o=[]
    players.s=[]
    players.e=[]
        

    let currentIndex = array.length,  randomIndex;
    
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
    
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    for (let i = 0; i < 32; i++) { 
        if (i<8) {
            players.n.push(cards[i])
        }
        else if (i<16) {
            players.s.push(cards[i])
        }
        else if (i<24) {
            players.e.push(cards[i])
        }
        else players.o.push(cards[i])
    }
    sendClient()
}
function sendClient(){//a voir si save histo plus tard
    io.to(players.nord).emit('cards',players.n)
    io.to(players.sud).emit('cards',players.s)
    io.to(players.ouest).emit('cards',players.o)
    io.to(players.est).emit('cards',players.e)
    io.emit('aQui',aQui())
}


/*----DETECTION GAGNANT PLI--- */
function suivant(){
    if (boucleCount>3) {
        boucleCount=0
    }
    boucleCount++
}
function aQui(){
    return ordre[boucleCount]
}
function setAQui(pos){
    boucleCount=ordre.indexOf(pos)
}


function verifPli(){//verfieir J1
    if (posPli.nord!=''&&posPli.est!=''&&posPli.sud!=''&&posPli.ouest!='') {
        ord()
        posPli.nord=''
        posPli.est=''
        posPli.sud=''
        posPli.ouest=''
    }
    else{
        console.log('k1k1 a pas jouer')
        console.log(posPli);
    }
}

function ord(){ //je veux une fonction qui me retourne l'ordre NESO et envoi un emit (a X de jouer en attente de carte) ca fait une boucle compteur
    let j1=aQui()//idToPos(id)
    let arr=[]
    //arr[0] doit etre le joueur initial ! et apres N E S O ordre //a opti si pas la flemme

    ordre.indexOf(j1)
    for (let i = ordre.indexOf(j1); i < (ordre.indexOf(j1)+4); i++) {
        arr.push(posPli[ordre[i]])
    }
    arr.push(atout)
    pli(arr);
}

function pli(pli){//pli = objet de 4 cartes J1 en premier

    let atout=pli[4]
    let winner = pli[0]
    for (let i = 1; i < 4; i++) {
        if (winner[1]==atout && pli[i][1]==atout && winner[0]< pli[i][0]) {//si on joue atout valuer max gagne (J et 9 a traiter)
            winner=pli[i]
        } 
        else if(pli[0][1]!=atout && pli[i][1]==atout){ // si pli est pas un atout et est coupé ET winner est un atout inferieur !//    ex Ad Kd Qh Jh atout =h =>24 21 5 4
            if (winner[1]==atout && winner[0] < pli[i][0]) {//si DEJA coupé atout superieur win
                winner=pli[i]
            }
            //si pas coupé alors prend le pli
            else if (winner[1]!=atout){winner=pli[i]}
        }
        else if (pli[0][1]==pli[i][1] && pli[i][0]>pli[0][0] ) {// if color identique et valeur inf => faut rajouter if color = atout OU alors dope la valeur de l'atout ! //voit si besoin ajout verif pas atout
            winner= pli[i]
        }
    }
    console.log(aQui()+' etait le j1');
    console.log(winner +" gagne "+ calculPoints(pli));
    histoPoints+=calculPoints(pli)
    io.emit('points',histoPoints)
    histoPoints=0 //a sauvegarder en fonction des equipes blabla

    if (posPli.nord==winner){
        console.log('nord a win');
        setAQui('nord')
    }
    else if (posPli.est==winner){
        console.log('nord a win');
        setAQui('est')
    }
    else if (posPli.sud==winner){
        console.log('nord a win');
        setAQui('sud')
    }
    else if (posPli.ouest==winner){
        console.log('nord a win');
        setAQui('ouest')
    }
    console.log('ligne 248 a revoir flemme');
    
   
}
function convert(card,atout){// 13 = Qs= return 6s
 
    let color;
    let malus=0
    //voit si need parseInt

    if (card<8) {
        color="h"
    }
    else if (card<16) {
        color="s"
        malus=8
    }
    else if (card<24) {
        color="d"
        malus=16
    }
    else if (card<32) {
        color="c"
        malus=24
    }
    else {return 'err'}

    let cf=card-malus
    if (atout==color && cf==2){
        cf=8
    }
    else if (atout==color && cf==3){
        cf=9
    }
    cf=cf+color
    console.log(cf);
    return cf
}
/*---------COMPTAGE POINT---------- */
function calculPoints(pli){
    // 0 = 7 / 1 =8 / 2= 9 3= J / 4= Q / 5=K/ T=6/ A=7 / 9atout = 8 / Jatout = 9
    let pointsPli=0

    for (let i = 0; i < 4; i++) {
        if(pli[i][0]==8){
            pointsPli+=14
        }
        else if(pli[i][0]==9){
            pointsPli+=20
        }

        else if(pli[i][0]==3){
            pointsPli+=2
        }
        else if(pli[i][0]==4){
            pointsPli+=3
        }
        else if(pli[i][0]==5){
            pointsPli+=4
        }
        else if(pli[i][0]==6){
            pointsPli+=10
        }
        else if(pli[i][0]==7){
            pointsPli+=11
        }
    }
    return pointsPli
}

/*--------attribute fam--------- */
function shiftFam(socketId){//borne le tableau !
    let position=coPlayer.shift()
    players[position]=socketId
    io.to(socketId).emit('position',position)
    console.log(players); 
}
function unshiftFam(socketId){
    coPlayer.unshift(idToPos(socketId))
}

function idToPos(id){
    for(const [k,v] of Object.entries(players)){//je recois un socketId je veux parcourir talbeau joueur pour avoir sa position  
        if(v==id){
            return k;
        }
    }
}