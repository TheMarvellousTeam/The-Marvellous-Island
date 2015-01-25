package org.marvellous.chickens.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.scenes.scene2d.Actor;

public class Background extends Actor{
	private TextureRegion texture;
	
	public Background(Texture background){
		super();
		texture = new TextureRegion(background,0,0,480, 800);
	}

	@Override
	public void draw(Batch batch, float parentAlpha) {
		super.draw(batch, parentAlpha);
		batch.draw(texture, 0,0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
	}
}