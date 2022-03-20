import Phaser from "phaser";
import HighScore from "../ui/HighScore";

import ScoreLabel from "../ui/ScoreLabel";
import BombSpawner from "./BombSpawner";

const GROUND_KEY='ground';
const PLAYER_KEY='dude';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';
var count=0;
var levChange;
const AllScenes=['game-scene','game-scene2','game-scene3','game-scene4'];

export default class GameScene2 extends Phaser.Scene{
    constructor(){
        super('game-scene2')
        this.gameOver=false
    }
    init(data){
        this.oldScore=data.score
        this.newChange=data.change
    }
    preload(){
        this.load.image('sky','assets/sky.png')
        this.load.image(GROUND_KEY,'assets/platform.png')
        this.load.image(STAR_KEY,'assets/thunder.png')
        this.load.image(BOMB_KEY,'assets/bomb.png')

        this.load.spritesheet(PLAYER_KEY,'assets/dude.png',
        {frameWidth:32, frameHeight:48})
    }
    create(){
        this.add.image(400, 300, 'sky')
    	// this.add.image(400, 300, 'star')
        this.scoreLabel = this.createScoreLabel(16, 16, 0)
        this.scoreLabel.setScore(this.oldScore);
        const platforms=this.createPlatforms()

        this.player=this.createPlayer()
        this.stars = this.createStars()

        

        this.bombSpawner = new BombSpawner(this, BOMB_KEY)
        const bombsGroup = this.bombSpawner.group

        this.physics.add.collider(this.player,platforms)
        this.physics.add.collider(this.stars, platforms)
        this.physics.add.collider(bombsGroup, platforms)
        this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this)

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    collectStar(player, star)
	{
		star.disableBody(true, true)
        
        count++;
        this.scoreLabel.add(10)

        if (this.stars.countActive(true) === 0)
		{
			//  A new batch of stars to collect
			this.stars.children.iterate((c) => {
                const child=(/** @type {Phaser.Physics.Arcade.Sprite} */(c))
				child.enableBody(true, child.x, 0, true, true)
			})
		}
        if(count%4===0)
		this.bombSpawner.spawn(player.x)
	}

    update()
	{
        if (this.gameOver)
		{
            var keyObj = this.input.keyboard.addKey('R');  

			if (keyObj.isDown)
            {
                window.location.reload();
            }
		}
        if(this.scoreLabel.score > this.oldScore)
        {
            levChange=this.newChange
            if(this.scoreLabel.score > levChange)
        {
            levChange=levChange+ this.scoreLabel.score*0.75;
            this.scene.start(AllScenes[Math.floor((Math.random() * 4) + 0)],{score: this.scoreLabel.score, change:levChange})
        }
        }
        




        // if(this.scoreLabel.score >= 80)
        // {
        //     this.scene.start(AllScenes[2],{score: this.scoreLabel.score})
        // }

		if (this.cursors.left.isDown)
		{
			this.player.setVelocityX(-160)

			this.player.anims.play('left', true)
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityX(160)

			this.player.anims.play('right', true)
		}
		else
		{
			this.player.setVelocityX(0)

			this.player.anims.play('turn')
		}

		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			this.player.setVelocityY(-330)
		}
	}



    createPlatforms(){
        const platforms=this.physics.add.staticGroup()

        platforms.create(400,568,GROUND_KEY).setScale(2).refreshBody()

            platforms.create(100,400,GROUND_KEY)
            platforms.create(800,400,GROUND_KEY)
            platforms.create(450,250,GROUND_KEY)
            // platforms.create(350,100,GROUND_KEY)
        

        return platforms
    }
    createPlayer(){
        const player=this.physics.add.sprite(100,450,PLAYER_KEY)
        player.setBounce(0.2)
        player.setCollideWorldBounds(true);

        this.anims.create({
            key:'left',
            frames: this.anims.generateFrameNumbers(PLAYER_KEY,
                {
                    start:0,
                    end:3
                }),
            frameRate:10,
            repeat:-1
        })

        this.anims.create({
            key:'turn',
            frames: [{
                key:PLAYER_KEY,
                frame:4
            }],
            frameRate: 20
        })

        this.anims.create({
            key:'right',
            frames:this.anims.generateFrameNumbers(PLAYER_KEY,{
                start:5,
                end:8
            }),
            frameRate:10,
            repeat:-1
        })

        return player
    }
    createStars()
	{
		const stars = this.physics.add.group({
			key: STAR_KEY,
			repeat: 11,
            setScale: {x:1.5,y:3},
			setXY: { x: 12, y: 0, stepX: 70 },
           
		})
		
		stars.children.iterate((c) => {
            const child=(/** @type {Phaser.Physics.Arcade.Sprite} */(c))
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})

		return stars
	}
    createScoreLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#000' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}
    hitBomb(player, bomb)
	{
		this.physics.pause()

		player.setTint(0xff0000)

		player.anims.play('turn')
        this.finalScore=new HighScore(this,40,40,this.scoreLabel.score, {fontSize:'40px',fill:'#fff'})
        this.add.existing(this.finalScore)
		this.gameOver = true
	}

}