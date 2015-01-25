package org.marvellous.chickens.screens;

import java.util.ArrayList;
import java.util.List;

import org.marvellous.chickens.TheMarvellousChickens;
import org.marvellous.chickens.operation.CmdOperation;

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
import com.badlogic.gdx.scenes.scene2d.ui.ImageButton;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Label.LabelStyle;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.badlogic.gdx.utils.viewport.StretchViewport;

public class ControllerScreen implements Screen{
	private TheMarvellousChickens game;
	
	private Stage stage;
	private Skin skin;
	private List<CmdOperation> operations;
	private List<ImageButton> cmdButtons;
	private Label selected;
	public ControllerScreen(TheMarvellousChickens game){
		this.game = game;
		operations = new ArrayList<CmdOperation>();
		cmdButtons = new ArrayList<ImageButton>();
	}
	
	
	private class ActionSlot extends Actor{
		ShapeRenderer renderer;
		private int position ;
		private Color color;
		public ActionSlot(int pos, Color color){
			renderer = new ShapeRenderer();
			this.position = pos;
			this.color = color;
		}
		@Override
		public void draw(Batch batch, float parentAlpha) {
			//super.draw(batch, parentAlpha);
			int width = Gdx.graphics.getWidth() /4;
		}
	}
	
	
	@Override
	public void show() {
		System.out.println("show");
		System.out.println(Gdx.graphics.getWidth()+","+Gdx.graphics.getHeight());
		stage = new Stage(new StretchViewport(720, 1180));
		
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
		selected.setPosition(200, 200);
		
		
		stage.addActor(new Background(new Texture(Gdx.files.internal("background/controller.png"))));
		stage.addActor(selected);
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

}
