package org.marvellous.chickens.screens;

import java.util.ArrayList;
import java.util.List;

import org.marvellous.chickens.TheMarvellousChickens;
import org.marvellous.chickens.operation.ChickenJSON;
import org.marvellous.chickens.operation.CmdOperation;
import org.marvellous.chickens.operation.Operation;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Screen;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Pixmap.Format;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Label.LabelStyle;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.badlogic.gdx.utils.viewport.StretchViewport;

public class ControllerScreen implements Screen, DirectionSelectorListener{
	private TheMarvellousChickens game;
	
	private Stage stage;
	private Skin skin;
	private List<CmdOperation> operations;
	private List<CommandSelector> cmdSelectors;
	private Label selected;
	private DirectionSelector dirSelector;
	private CmdOperation currentOp;
	public ControllerScreen(TheMarvellousChickens game){
		this.game = game;
		operations = new ArrayList<CmdOperation>();
		cmdSelectors = new ArrayList<CommandSelector>();
		
		cmdSelectors.add(new CommandSelector("background/moveButton.png", this, "move", 0.6f));
		cmdSelectors.add(new CommandSelector("background/fireButton.png", this, "fire",0.6f));

	}
	
	
	@Override
	public void show() {
		dirSelector = new DirectionSelector(this);
		dirSelector.setPosition(Gdx.graphics.getWidth() /2 - (dirSelector.getWidth()/2), Gdx.graphics.getHeight()/2 - (dirSelector.getHeight()/2));
		dirSelector.setVisible(false);
		System.out.println("show");
		System.out.println(Gdx.graphics.getWidth()+","+Gdx.graphics.getHeight());
		stage = new Stage(new StretchViewport(720, 1180));
		Gdx.input.setInputProcessor(stage);
		skin = new Skin();
		
		Pixmap pixmap = new Pixmap(1,1,Format.RGBA8888);
		pixmap.setColor(Color.WHITE);
		pixmap.fill();
		
		
		skin.add("white", new Texture(pixmap));
		skin.add("default", new BitmapFont());
		skin.getFont("default").scale(2);
		
		LabelStyle labelStyle = new LabelStyle();
		labelStyle.font = skin.getFont("default");
		labelStyle.fontColor = Color.BLACK;
		skin.add("default", labelStyle);
		
		
		
		
		
		selected = new Label("", skin);
		selected.setPosition(200, 800);
		
		stage.addActor(new Background(new Texture(Gdx.files.internal("background/controller.png"))));
		stage.addActor(selected);
		
		for(int i = 0; i < cmdSelectors.size(); i++){
			CommandSelector selector = cmdSelectors.get(i);
			selector.getButton().setPosition(280, 320+(i*220));
			stage.addActor(selector.getButton());
			System.out.println(i);
		}
		stage.addActor(dirSelector);
		setSelected("test");
	}

	@Override
	public void render(float delta) {
		Gdx.gl.glClearColor(1f, 1f, 1f, 1f);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
		stage.act(delta);
		stage.draw();
	}

	@Override
	public void resize(int width, int height) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void pause() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void resume() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void hide() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void dispose() {
		// TODO Auto-generated method stub
		
	}
	public void addNewCommand(CmdOperation op){
		if(operations.size() < 4){
			currentOp = op;
			dirSelector.setVisible(true);
		}
	}
	
	public void setSelected(String text){
		selected.setText(text);
		System.out.println(text);
	}


	@Override
	public void onDirectionChoosen(int x, int y) {
		dirSelector.setVisible(false);
		if(currentOp != null){
			currentOp.x = x;
			currentOp.y = y;
			operations.add(currentOp);
			currentOp = null;
			if(operations.size() == 4){
				String buf = "[";
				for(int i  = 0; i < operations.size() - 1; i ++){
					buf += ChickenJSON.toJSON(operations.get(i)) + ",";
				}
				buf += ChickenJSON.toJSON(operations.get(operations.size()-1));
				buf += "]";
				System.out.println(buf);
				game.getSocket().send(buf);
			}
			
		}
	}


}
