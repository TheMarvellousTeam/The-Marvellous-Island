package org.marvellous.chickens.screens;

import org.marvellous.chickens.operation.ChickenJSON;
import org.marvellous.chickens.operation.CmdOperation;
import org.marvellous.chickens.operation.Operation;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.scenes.scene2d.Event;
import com.badlogic.gdx.scenes.scene2d.EventListener;
import com.badlogic.gdx.scenes.scene2d.ui.ImageButton;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;

public class CommandSelector implements EventListener{
	private String imagePath;
	private ImageButton button;
	private ControllerScreen controller;
	private String type;
	public CommandSelector(String imagePath, ControllerScreen screen, String type, float scale){
		this.type = type;
		this.controller = screen;
		this.imagePath = imagePath;
		TextureRegion tr = new TextureRegion(new Texture(Gdx.files.internal(imagePath)));
		button = new ImageButton(new TextureRegionDrawable(tr));
		button.getImage().scaleBy(scale);
		button.addListener(CommandSelector.this);
		System.out.println("a"  + button.getListeners());
		System.out.println(this);
	}
	public ImageButton getButton(){
		return button;
	}
	
	@Override
	public boolean handle(Event event){
		if(this.getButton() != event.getTarget())
			return false;
		System.out.println("handle");
		CmdOperation op = new CmdOperation(type);
		controller.addNewCommand(op);
		controller.setSelected(op.type);
		System.out.println(ChickenJSON.toJSON(op));
		return false;
	}
}
