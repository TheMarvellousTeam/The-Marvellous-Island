package org.marvellous.chickens.screens;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.marvellous.chickens.TheMarvellousChickens;
import org.marvellous.chickens.operation.ChickenJSON;
import org.marvellous.chickens.operation.CmdOperation;

import sun.awt.windows.WWindowPeer;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Screen;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Pixmap.Format;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.scenes.scene2d.Event;
import com.badlogic.gdx.scenes.scene2d.EventListener;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.ImageButton;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Label.LabelStyle;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.viewport.StretchViewport;

public class ControllerScreen implements Screen, DirectionSelectorListener, EventListener{
	private TheMarvellousChickens game;
	
	private Stage stage;
	private Skin skin;
	private List<CmdOperation> operations;
	private List<CommandSelector> cmdSelectors;
	private DirectionSelector dirSelector;
	private CmdOperation currentOp;
	
	private double widthRatio ;
	private double heightRatio ;
	private SpriteBatch batch;
	
	private ImageButton applyButton;
	private ImageButton cancelButton;
	
	private Map<String, Texture> textures;
	private Map<String, Boolean> opNeedDirection;
	public ControllerScreen(TheMarvellousChickens game){
		this.game = game;
		operations = new ArrayList<CmdOperation>();
		cmdSelectors = new ArrayList<CommandSelector>();
		
		cmdSelectors.add(new CommandSelector("background/walk.png", this, "move", (float)(0.6f*widthRatio)));
		cmdSelectors.add(new CommandSelector("background/fire.png", this, "fire_push_bullet",(float)(0.6f*heightRatio)));
		cmdSelectors.add(new CommandSelector("background/peck.png", this, "peck",(float)(0.6f*heightRatio)));
		batch = new SpriteBatch();
		textures = new HashMap<String, Texture>();
		textures.put("move", new Texture(Gdx.files.internal("background/walk.png")));
		textures.put("fire_push_bullet", new Texture(Gdx.files.internal("background/fire.png")));
		textures.put("peck", new Texture(Gdx.files.internal("background/peck.png")));
		
		applyButton = new ImageButton(new TextureRegionDrawable(new TextureRegion(new Texture(Gdx.files.internal("background/Yes.png")))));
		cancelButton = new ImageButton(new TextureRegionDrawable(new TextureRegion(new Texture(Gdx.files.internal("background/no.png")))));
		applyButton.scaleBy(1.5f);
		cancelButton.scaleBy(1.5f);
		applyButton.setDisabled(true);
		opNeedDirection = new HashMap<String, Boolean>();
		
		opNeedDirection.put("move", true);
		opNeedDirection.put("fire_push_bullet", true);
		opNeedDirection.put("peck", false);
	}
	
	
	@Override
	public void show() {
		
		widthRatio = Gdx.graphics.getWidth()/720. ;
		heightRatio = Gdx.graphics.getHeight()/1180. ;
		
		
		dirSelector = new DirectionSelector(this);
		dirSelector.setPosition(Gdx.graphics.getWidth() /2 - (dirSelector.getWidth()/2), Gdx.graphics.getHeight()/2 - (dirSelector.getHeight()/2));
		dirSelector.setVisible(false);
		System.out.println("show");
		System.out.println(Gdx.graphics.getWidth()+","+Gdx.graphics.getHeight());
		stage = new Stage(new StretchViewport(Gdx.graphics.getWidth(), Gdx.graphics.getHeight()));
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
		
		applyButton.setPosition(0, 100);
		cancelButton.setPosition(500, 100);
		applyButton.setDisabled(true);
		applyButton.addListener(this);
		cancelButton.addListener(this);
		cancelButton.setDisabled(true);
		
		
		
		stage.addActor(new Background(new Texture(Gdx.files.internal("background/controller_ok.png"))));
		stage.addActor(applyButton);
		stage.addActor(cancelButton);
		for(int i = 0; i < cmdSelectors.size(); i++){
			CommandSelector selector = cmdSelectors.get(i);
			selector.getButton().setPosition((int)(280*widthRatio), (int)((320+(i*220)*heightRatio)));
			stage.addActor(selector.getButton());
			System.out.println(i);
		}
		stage.addActor(dirSelector);
	}

	@Override
	public void render(float delta) {
		Gdx.gl.glClearColor(1f, 1f, 1f, 1f);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
		stage.act(delta);
		stage.draw();
		
		batch.begin();
		int w = Gdx.graphics.getWidth() / 4;
		int height = Gdx.graphics.getHeight();
		for(int i = 0; i < operations.size(); i++){
			String op = operations.get(i).type;
			Texture text = textures.get(op);
			if(text != null)
				batch.draw(text, i*w, height-w, w, w);
			else
				System.out.println("impossible de dessiner " + op);
		}
		batch.end();
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
			if(opNeedDirection.get(op.type)){
				dirSelector.setVisible(true);
			}else
				onDirectionChoosen(0, 0);
		}
	}
	
	public void clearCommands(){
		operations.clear();
	}
	


	@Override
	public void onDirectionChoosen(int x, int y) {
		dirSelector.setVisible(false);
		if(currentOp != null){
			currentOp.x = x;
			currentOp.y = y;
			operations.add(currentOp);
			cancelButton.setDisabled(false);
			currentOp = null;
			if(operations.size() == 4){
				applyButton.setDisabled(false);
				System.out.println("TEST enable");
			}
			
		}
	}
	public void sendOperations(){
		String buf = "[";
		for(int i  = 0; i < operations.size() - 1; i ++){
			buf += ChickenJSON.toJSON(operations.get(i)) + ",";
		}
		buf += ChickenJSON.toJSON(operations.get(operations.size()-1));
		buf += "]";
		System.out.println(buf);
		game.getSocket().send(buf);
	}


	@Override
	public boolean handle(Event event) {
		System.out.println("TEST handle");
		if(event.getTarget() == applyButton){
			sendOperations();
			applyButton.setDisabled(true);
		}
		if(event.getTarget() == cancelButton){
			if(!operations.isEmpty())
				operations.remove(operations.size()-1);
			if(operations.size() == 0){
				cancelButton.setDisabled(true);
			}
		}
		return false;
	}


}
