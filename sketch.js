var sandyImage, virusImage, virusKingImage, dropImage, babyVirusImage, pumpedImage, backdrop
var SandyHanitizer, VirusKing, Drops, BabyVirus
var Viruses
var BV_Array=[]
var V_Array=[]
var D_Array=[]
var array, length
var BabyVirusGroup, VirusGroup, DropsGroup
var Health=15
var Score=0
var gameState="start"
var King=20
var edges
var timer=0
var timerCount=0

function preload(){
    sandyImage=loadImage("Images/Sandy Hanitizer.png");
    virusImage=loadImage("Images/Virus.png");
    virusKingImage=loadImage("Images/Virus King.png");
    babyVirusImage=loadImage("Images/Baby Virus.png");
    backdrop=loadImage("Images/Background.png");
    dropImage=loadImage("Images/Pump.png")
}

function setup(){
    var canvas=createCanvas(displayWidth-30,displayHeight);

    edges= createEdgeSprites();

    SandyHanitizer=createSprite(260, 590);
    SandyHanitizer.addImage(sandyImage);
    SandyHanitizer.scale=0.4

    VirusKing=createSprite(250, 50);
    VirusKing.addImage(virusKingImage);
    VirusKing.scale=0.4
    VirusKing.visible=false
    VirusKing.velocityY=3
    VirusKing.velocityX=Math.round(random(2,4))

    BabyVirusGroup=new Group();
    VirusGroup=new Group();
    DropsGroup=new Group();

}

function draw(){
    background(backdrop);
    VirusKing.bounceOff(edges);
    if(gameState==="start"){
        textStyle(BOLD)
        textSize(20)
        fill("blue")
        text("Rules: ", 10, 40)
        textSize(13)
        fill("black")
        text("There are Viruses spawing from the right,", 10, 70)
        text("Shoot them before they leave the screen to cure the world.", 10, 90) 
        text("Click the space key and shoot pumps of hand sanitizer to destroy them.", 10, 110)
        text("Staying in one spot shoots more drops with one click. Move away to stop.", 10, 130)
        text("Baby Viruses will come out randomly and try to get you sick.", 10, 150)
        text("Dodge them to stay quarentined. You have 15 sickness blockers.", 10, 170) 
        text("Lose them all, and the world gets infested.", 10, 190)
        text("After curing 15 cases, meet the Virus King.", 10, 210)
        text("Dodge him for 20 seconds to cure the world.", 10, 230)
        text("Stay Safe and have fun! Click enter to begin,", 10, 250)
        if(keyCode===13){
            gameState="play"
        }
    }

    if(gameState==="play"){

        Virus();
        babyViruses();
        gameOver();

            for(var i=0; i<BabyVirusGroup.length; i++){
            if(BabyVirusGroup.get(i).isTouching(SandyHanitizer)){ 
                    BabyVirusGroup.get(i).destroy();
                    Health--
                }
            }

            for(var i=0; i<VirusGroup.length; i++){
                if(VirusGroup.get(i).isTouching(DropsGroup)){ 
                    VirusGroup.get(i).destroy();
                    Score++
                }
            }

            if(Score===15){
                gameState="king"
                virusKing();
            }
}

    if (gameState==="king"){
        if (timerCount === 0) {
            timerCount = Math.round(frameCount/32);
        }
        textSize(25)
        fill("black")
        text("Time Survived: " + timer + " seconds", 120, 30)
        timer=Math.round(frameCount/32)-timerCount;

        if(timer===20){
            win();
        }
        
        if(SandyHanitizer.isTouching(VirusKing)){
            Health=0
            gameOver();
        }
    }
    
    drawSprites();

    textSize(20);
    fill("black");
    text("Sickness: " + Health, 370, 690);
    text("Cases Cured: " + Score, 30, 690);

    if(gameState==="play" || gameState==="king"){
        if(SandyHanitizer.x>30){
            if(keyIsDown(LEFT_ARROW)){
                SandyHanitizer.x=SandyHanitizer.x-10
            } 
        }
        
        if(SandyHanitizer.x<470){  
            if(keyIsDown(RIGHT_ARROW)){
                SandyHanitizer.x=SandyHanitizer.x+10
            }
        }

        pumps();

    }

    if(gameState==="win"){
        textSize(20)
        fill("black")
        text("The world was cured!", 150, 350); 
    }

    if(gameState==="lose"){
        textSize(20)
        fill("black")
        text("The world was infested....", 150, 350);
    }

}

function Virus(){
    if(frameCount%100===0){
        Viruses=createSprite(500, Math.round(random(50, 150)));
        Viruses.addImage(virusImage);
        Viruses.scale=0.3
        Viruses.velocityX=-3
        VirusGroup.add(Viruses)
        V_Array=(Viruses)
    }
}

function babyViruses(){
    if(frameCount%70===0){
        BabyVirus=createSprite(Math.round(random(50,450)), 50);
        BabyVirus.addImage(babyVirusImage)
        BabyVirus.scale=0.05
        BabyVirus.velocityY=3
        BabyVirusGroup.add(BabyVirus);
        BV_Array.push(BabyVirus)
    }
}

function pumps(){
    if(frameCount%20===0 && keyCode===32){
        Drops=createSprite(SandyHanitizer.x, SandyHanitizer.y-50);
        Drops.addImage(dropImage);
        Drops.scale=0.2
        Drops.velocityY=-4
        DropsGroup.add(Drops)
        D_Array.push(Drops)
    }

}

function gameOver(){
    if(Health<=0){
        gameState="lose"
        VirusGroup.destroyEach();
        BabyVirusGroup.destroyEach();
        DropsGroup.destroyEach();
        VirusKing.visible=false
        SandyHanitizer.velocityX=0
    }
}

function virusKing(){
    VirusGroup.destroyEach();
    BabyVirusGroup.destroyEach();
    VirusKing.visible=true;
}

function win(){
    gameState="win"
    VirusKing.visible=false
    SandyHanitizer.velocityX=0
}