import Phaser from 'phaser'

const formatScore = (score)=>{
    return `HighScore: ${score}
    Press R to RESTART`
}
export default class HighScore extends Phaser.GameObjects.Text
{
	constructor(scene, x, y, score, style)
	{
		super(scene, x, y, formatScore(score), style)

		this.score = score
	}

	setScore(score)
	{
		this.score  = score
		this.updateScoreText()
	}
	updateScoreText()
	{
		this.setText(formatScore(this.score))
	}
}