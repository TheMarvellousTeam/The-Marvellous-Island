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
	
	
	
	public MenuScreen(TheMarvellousChickens game){
		this.game = game;
	}
	public void show(){
		stage = new Stage(new StretchViewport(720, 1180));
		Gdx.input.setInputProcessor(stage);
		
		stage.addActor(new Background(new Texture(Gdx.files.internal("background/menu2.png"))));
		
		
		//creation du skin du stage
		skin = new Skin();
		Pixmap pixmap = new Pixmap(1,1,Format.RGBA8888);
		pixmap.setColor(Color.WHITE);
		pixmap.fill();
		
		skin.add("white", new Texture(pixmap));
		skin.add("default", new BitmapFont());
		skin.getFont("default").scale(2);
		
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
		tfstyle.background = skin.newDrawable("white", Color.PINK);
		tfstyle.cursor = skin.newDrawable("white", Color.PURPLE);
		
		//skin du label
		LabelStyle labelStyle = new LabelStyle();
		labelStyle.font = skin.getFont("default");
		labelStyle.fontColor = Color.BLACK;
		
		skin.add("default", tbstyle);
		skin.add("default", tfstyle);
		skin.add("default", labelStyle);
		
		int midWitdh = Gdx.graphics.getWidth()/2;
		int xField = midWitdh - 80;
		connectButton = new ImageButton(new TextureRegionDrawable(new TextureRegion(new Texture(Gdx.files.internal("background/playButton.png")))));
		connectButton.setPosition(300, 150);
		connectButton.addListener(this);
		ipField = new TextField("10.45.18.219", skin);
		ipField.setPosition(xField, 820);
		ipField.setHeight(60);
		ipField.setWidth(300);
		
		portField = new TextField("31415", skin);
		portField.setPosition(xField, 700);
		portField.setHeight(60);
		portField.setWidth(300);
		
		nameField = new TextField("Simon", skin);
		nameField.setPosition(xField, 610);
		nameField.setHeight(60);
		nameField.setWidth(300);
		
		
		connexionStateLabel = new Label("", skin);
		connexionStateLabel.setPosition(220, 100,Align.center);
		connexionStateLabel.setWidth(200);
		
		stage.addActor(ipField);
		stage.addActor(portField);
		stage.addActor(nameField);
		stage.addActor(connectButton);
		stage.addActor(connexionStateLabel);
		
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
			}else{
				connexionStateLabel.setText("Impossible de se connecter au serveur.");
			}
		}
		return false;
	}
	
}
