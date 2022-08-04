var socket = io()
var atout="d"
document.getElementById(atout).classList.add('aQui')
var contrat = 90

const ordre=["nord","est","sud","ouest"] 

function defineAtout(color){
    document.getElementById(atout).classList.remove('aQui')
    atout=color
    document.getElementById(atout).classList.add('aQui')
}
function bet(bet){
    contrat=bet
    mise()
}

socket.on('erreur',(err)=>{
    alert(err)
})
socket.on('aQui',(aQui)=>{
    console.log(aQui+ ' de jouer');

    let i=ordre.indexOf(aQui)-1
    let prec= ordre[i]
    if (i==-1){
        prec='ouest'
    }

    document.getElementById(prec).classList.remove('aQui')
    document.getElementById(aQui).classList.add('aQui')
})
socket.on('position',(position)=>{
    document.getElementById('pos').innerHTML=position
})
socket.on('points',(points)=>{ console.log(points+' points dernier pli');
    document.getElementById('points').innerHTML=points
})

socket.on('cards',(p)=>{
    players=p.sort()
    console.log(players);
    for (let i = 0; i < players.length; i++) {
        document.getElementById("cards").children[i].children[0].src=`img/${players[i]}.png`
        document.getElementById("cards").children[i].children[0].classList.add(players[i])
        document.getElementById("cards").children[i].addEventListener('click',()=>{clickCard(players[i])})
    } 
})
socket.on('refresh',(p)=>{ //a opti
   
    players=p.sort()
    console.log(players);

    for (let i = 0; i < players.length; i++) {
        document.getElementById("cards").children[i].children[0].src=`img/${players[i]}.png`
        document.getElementById("cards").children[i].children[0].classList.add(players[i])
        document.getElementById("cards").children[i].addEventListener('click',()=>{clickCard(players[i])})
    }
    if(document.getElementById("cards").children[players.length]!=undefined){
        document.getElementById("cards").children[players.length].children[0].classList.add('hide')
    }    
})

function suivant(){
    socket.emit('suivant')
}

function draw(){
    socket.emit('draw')
}
function mise(){
    socket.emit('mise',{contrat:contrat,atout:atout})
}

function clickCard(i){
    socket.emit('selectCard',i)
    //document.getElementsByClassName(i)[0].classList.add('hide')
}

