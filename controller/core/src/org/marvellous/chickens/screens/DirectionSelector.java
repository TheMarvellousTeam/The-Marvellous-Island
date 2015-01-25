package org.marvellous.chickens.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.scenes.scene2d.Event;
import com.badlogic.gdx.scenes.scene2d.EventListener;
import com.badlogic.gdx.scenes.scene2d.ui.ImageButton;
import com.badlogic.gdx.scenes.scene2d.ui.Table;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;

public class DirectionSelector extends Table implements EventListener{
	
	
	private ImageButton NE;
	private ImageButton SE;
	private ImageButton SW;
	private ImageButton NW;
	
	private Table layout;
	private DirectionSelectorListener listener;
	public DirectionSelector(DirectionSelectorListener listener){
		layout = new Table();
		NE = new ImageButton(new TextureRegionDrawable(new TextureRegion(new Texture(Gdx.files.internal("background/NE.png")))));
		SE = new ImageButton(new TextureRegionDrawable(new TextureRegion(new Texture(Gdx.files.internal("background/SE.png")))));
		SW = new ImageButton(new TextureRegionDrawable(new TextureRegion(new Texture(Gdx.files.internal("background/SW.png")))));
		NW = new ImageButton(new TextureRegionDrawable(new TextureRegion(new Texture(Gdx.files.internal("background/NW.png")))));
		this.listener = listener;
		layout.add(NW);
		layout.add(NE);
		layout.row();
		layout.add(SW);
		layout.add(SE);
		
		
		NE.addListener(this);
		SE.addListener(this);
		SW.addListener(this);
		NW.addListener(this);
		
		addActor(layout);
		
		
	}
	
	
	@Override
	public void draw(Batch batch, float parentAlpha) {
		super.draw(batch, parentAlpha);
	}


	@Override
	public boolean handle(Event event) {
		System.out.println("FIRE");
		int x =0;
		int y = 0;
		if(NE == event.getTarget()){
			y = 1;
		}else if(SE == event.getTarget()){
			x = 1;
		}else if(SW == event.getTarget()){
			y = -1;
		}else if(NW == event.getTarget()){
			x = -1;
		}
		else
			return false;
		listener.onDirectionChoosen(x, y);
		return false;
	}
}
