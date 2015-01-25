package org.marvellous.chickens.screens;

import org.marvellous.chickens.TheMarvellousChickens;
import org.marvellous.chickens.operation.ChickenJSON;
import org.marvellous.chickens.operation.CredentialsOp;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Screen;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Pixmap.Format;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Event;
import com.badlogic.gdx.scenes.scene2d.EventListener;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.ImageButton;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Label.LabelStyle;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton.TextButtonStyle;
import com.badlogic.gdx.scenes.scene2d.ui.TextField;
import com.badlogic.gdx.scenes.scene2d.ui.TextField.TextFieldStyle;
import com.badlogic.gdx.scenes.scene2d.utils.Align;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.viewport.StretchViewport;

public class MenuScreen implements Screen , EventListener{
	private Stage stage;
	private Skin skin;
	private TheMarvellousChickens game;
	
	private TextField ipField;
	private TextField portField;
	private TextField nameField;
	private ImageButton connectButton;
	private Label connexionStateLabel;
	
	private double widthRatio ;
	private double heightRatio ;
	
	public MenuScreen(TheMarvellousChickens game){
		this.game = game;
	}
	public void show(){
		stage = new Stage(new StretchViewport(Gdx.graphics.getWidth(), Gdx.graphics.getHeight()));
		
		widthRatio = Gdx.graphics.getWidth()/720. ;
		heightRatio = Gdx.graphics.getHeight()/1180. ;
		
		Gdx.input.setInputProcessor(stage);
		
		stage.addActor(new Background(new Texture(Gdx.files.internal("background/menu.png"))));
		
		
		//creation du skin du stage
		skin = new Skin();
		Pixmap pixmap = new Pixmap(1,1,Format.RGBA8888);
		pixmap.setColor(Color.WHITE);
		pixmap.fill();
		
		skin.add("white", new Texture(pixmap));
		skin.add("default", new BitmapFont());
		skin.getFont("default").scale((float)(2*widthRatio));
		
		//skin du button
		TextButtonStyle tbstyle = new TextButtonStyle();
		tbstyle.up = skin.newDrawable("white", Color.DARK_GRAY);
		tbstyle.down = skin.newDrawable("white", Color.DARK_GRAY);
		tbstyle.checked = skin.newDrawable("white", Color.BLUE);
		tbstyle.over = skin.newDrawable("white", Color.LIGHT_GRAY);
		
		tbstyle.font = skin.getFont("default");
		
		//skin du textfield
		TextFieldStyle tfstyle = new TextFieldStyle();
		tfstyle.font = skin.getFont("default");
		tfstyle.fontColor = Color.BLACK;
		//tfstyle.background = skin.newDrawable("white", Color.PINK);
		tfstyle.cursor = skin.newDrawable("white", Color.PURPLE);
		
		//skin du label
		LabelStyle labelStyle = new LabelStyle();
		labelStyle.font = skin.getFont("default");
		labelStyle.fontColor = Color.GREEN;
		
		skin.add("default", tbstyle);
		skin.add("default", tfstyle);
		skin.add("default", labelStyle);
		
		int midWitdh = Gdx.graphics.getWidth()/2;
		int xField = midWitdh - (int)(80*widthRatio);
		connectButton = new ImageButton(new TextureRegionDrawable(new TextureRegion(new Texture(Gdx.files.internal("background/transparent100.png")))));
		connectButton.setPosition((int)(300*widthRatio), (int)(150*heightRatio));
		connectButton.addListener(this);
		connectButton.scaleBy((float)(2*widthRatio), (float)(2*heightRatio));
		ipField = new TextField("10.45.18.219", skin);
		ipField.setPosition((int)(xField*widthRatio)-200, (int)(heightRatio*820));
		ipField.setHeight((int)(60*heightRatio));
		ipField.setWidth((int)(300*widthRatio));
		
		portField = new TextField("31415", skin);
		portField.setPosition((int)(xField*widthRatio)-200, (int)(700*heightRatio));
		portField.setHeight((int)(60*heightRatio));
		portField.setWidth((int)(300*widthRatio));
		
		nameField = new TextField("Simon", skin);
		nameField.setPosition((int)(xField*widthRatio+20), (int)(610*heightRatio)-15);
		nameField.setHeight((int)(60*heightRatio));
		nameField.setWidth((int)(300*widthRatio));
		
		
		connexionStateLabel = new Label("", skin);
		connexionStateLabel.setPosition((int)(220*widthRatio), (int)(100*heightRatio),Align.center);
		connexionStateLabel.setWidth((int)(200*widthRatio));
		
		//stage.addActor(ipField);
		//stage.addActor(portField);
		stage.addActor(nameField);
		stage.addActor(connectButton);
		//stage.addActor(connexionStateLabel);
		
		connexionStateLabel.setText("w:"+Gdx.graphics.getWidth()+", h:"+Gdx.graphics.getHeight());
		
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
		stage.dispose();
	}
	@Override
	public boolean handle(Event event) {
		if(connectButton == event.getTarget()){
			System.out.println("connect!");
			String ip = ipField.getText();
			int port = Integer.parseInt(portField.getText());
			String name = nameField.getText();
			connexionStateLabel.setText("Connexion en cours...");
			
			game.getSocket().connect(ip, port);
			if(game.getSocket().isConnected()){
				CredentialsOp creds = new CredentialsOp(name);
				game.getSocket().send(ChickenJSON.toJSON(creds));
				connexionStateLabel.setText("Connexion etablie.");
				game.setScreen(game.getControllerScreen());
			}else{
				connexionStateLabel.setText("Impossible de se connecter au serveur.");
			}
		}
		return false;
	}
	
}
