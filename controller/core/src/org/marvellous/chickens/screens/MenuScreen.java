package org.marvellous.chickens.screens;

import org.marvellous.chickens.TheMarvellousChickens;

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
import com.badlogic.gdx.graphics.g3d.particles.ParticleShader.AlignMode;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Event;
import com.badlogic.gdx.scenes.scene2d.EventListener;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Label.LabelStyle;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton.TextButtonStyle;
import com.badlogic.gdx.scenes.scene2d.ui.TextField;
import com.badlogic.gdx.scenes.scene2d.ui.TextField.TextFieldStyle;
import com.badlogic.gdx.scenes.scene2d.utils.Align;
import com.badlogic.gdx.utils.viewport.ScreenViewport;
import com.badlogic.gdx.utils.viewport.StretchViewport;

public class MenuScreen implements Screen , EventListener{
	private Stage stage;
	private Skin skin;
	private TheMarvellousChickens game;
	
	private TextField ipField;
	private TextField portField;
	private TextField nameField;
	private TextButton connectButton;
	private Label connexionStateLabel;
	
	private class Background extends Actor{
		private TextureRegion texture;
		
		public Background(Texture background){
			super();
			texture = new TextureRegion(background,0,0,800,480);
		}

		@Override
		public void draw(Batch batch, float parentAlpha) {
			super.draw(batch, parentAlpha);
			batch.draw(texture, 0,0);
		}
	}
	
	public MenuScreen(TheMarvellousChickens game){
		this.game = game;
	}
	public void show(){
		stage = new Stage();
		Gdx.input.setInputProcessor(stage);
		
		stage.addActor(new Background(new Texture(Gdx.files.internal("background/menu.png"))));
		
		
		//creation du skin du stage
		skin = new Skin();
		Pixmap pixmap = new Pixmap(1,1,Format.RGBA8888);
		pixmap.setColor(Color.WHITE);
		pixmap.fill();
		
		skin.add("white", new Texture(pixmap));
		skin.add("default", new BitmapFont());
		
		
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
		connectButton = new TextButton("Land!", skin);
		connectButton.setPosition(300, 150);
		connectButton.addListener(this);
		ipField = new TextField("192.168.1.1", skin);
		ipField.setPosition(350, 300);
		
		portField = new TextField("1984", skin);
		portField.setPosition(350, 250);
		
		nameField = new TextField("Simon", skin);
		nameField.setPosition(350, 200);
		
		
		connexionStateLabel = new Label("", skin);
		connexionStateLabel.setPosition(220, 100,Align.center);
		connexionStateLabel.setWidth(200);
		
		stage.addActor(ipField);
		stage.addActor(portField);
		stage.addActor(nameField);
		stage.addActor(connectButton);
		stage.addActor(connexionStateLabel);
		
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
				game.getSocket().send("{name:" + name+"}");
				connexionStateLabel.setText("Connexion établie.");
			}else{
				connexionStateLabel.setText("Impossible de se connecter au serveur.");
			}
		}
		return false;
	}
	
}
