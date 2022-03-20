import Phaser from 'phaser'

// import HelloWorldScene from './scenes/HelloWorldScene'
import GameScene from './scenes/GameScene'
import GameScene2 from './scenes/GameScene2'
import GameScene3 from './scenes/GameScene3'
import GameScene4 from './scenes/GameScene4'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 }
		}
	},
	scene: [GameScene,GameScene2,GameScene3,GameScene4]
}

export default new Phaser.Game(config)
