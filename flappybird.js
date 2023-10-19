let board;
let boardWidth=360;
let boardHeight=640;
let context;


/* bird */
let birdWidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;

let bird={
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}


// PIPES
let pipeArray=[];
let pipeWidth=64;
let pipeHeight=512;
let pipeX=boardWidth;
let pipeY=0;

let topPipeImg;
let bottomPipeImg;

//PHYSICS
let velocityX=-2;//pipes moving in left direction
let velocityY=0;//bird jump speed
let gravity=0.2; //to move bird down


let gameOver=false;
//FOR UPDATING SCORE
let score=0;

window.onload=function()
{
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // DRAW FLAPPY BIRD 
    // context.fillStyle="green";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    // LOAD IMAGE
    birdImg=new Image();
    birdImg.src="./flappybird.png";
    birdImg.onload=function()
    {
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }
    
    // PIPES
    topPipeImg=new Image();
    topPipeImg.src="./toppipe.png";

    bottomPipeImg=new Image();
    bottomPipeImg.src="./bottompipe.png";


    requestAnimationFrame(update);
    
    setInterval(placePipes,1500);

    document.addEventListener("keydown",moveBird);
}

function update()
{
    requestAnimationFrame(update);

    //CHECKING WHETHER GAME IS OVER
    if(gameOver)
    {
        return;
    }

    context.clearRect(0,0,board.width,board.height);

    //BIRD
    velocityY += gravity;
    // bird.y +=velocityY;
    bird.y=Math.max(bird.y + velocityY, 0);//APLLY GRAVITY TO BIRR.Y AND LIMITS IT TO THE TOP OF CANVAS
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    if(bird.y > board.height)
     {
         gameOver=true;
     }

    //PIPE
    for(let i=0;i<pipeArray.length;i++)
    {
        let pipe=pipeArray[i];
        pipe.x+=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        
        //UPDATING SCORE AFTER EACH PIPE PASSED
        if(!pipe.passed && bird.x>pipe.x+pipe.width)
        {
            score +=0.5;//so that score updates by 1 after each (one top and bottom pipe) passed
            pipe.passed=true;
        }

        if(detectCollision(bird,pipe))
        {
            gameOver=true;
        }
    }

    //CLEAR THE PASSED PIPES
    while(pipeArray.length >0 && pipeArray[0].x < -pipeWidth)
    {
        pipeArray.shift();//removes 1st pipe from the array
    }

    //SCORE
    context.fillStyle="white";
    // context.font="45px sans-serif";
    context.font="45px  Handjet variant0, Tofu";
    context.fillText("SCORE: ",5,45);
    context.fillText(score,180,45);

    //DISPLAYING GAME OVER
    if(gameOver){
    context.fillText("GAME OVER",45,340);
    }
}

function placePipes()
{
    //IF GAME OVER, NO NEW PIPES ARE CREATED
    if(gameOver)
    {
        return;
    }


    let randomPipeY=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
    let openingSpace=board.height/4;


    let topPipe ={
        img :topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);


    let bottomPipe ={
        img :bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

//TO MOVE THE BIRD 
function moveBird(e)
{
    if(e.code=="space" || e.code=="ArrowUp" || e.code=="keyX")
    {
        velocityY=-6;
    }

    //RESTART THE GAME
    if(gameOver)
    {
        bird.y=birdY;
        pipeArray= [];
        score=0;
        gameOver=false;
    }
}


//DETECTING COLLISION
function detectCollision(a,b)
{
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}