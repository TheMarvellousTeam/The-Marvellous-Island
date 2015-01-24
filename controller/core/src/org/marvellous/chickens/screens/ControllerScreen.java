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
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Button;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Label.LabelStyle;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.badlogic.gdx.scenes.scene2d.ui.Table;

public class ControllerScreen implements Screen{
	private TheMarvellousChickens game;
	
	private Stage stage;
	private Table container;
	private Skin skin;
	public ControllerScreen(TheMarvellousChickens game){
		this.game = game;
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
			batch.end();
			renderer.setAutoShapeType(true);
			renderer.begin();
			renderer.setColor(color);
			renderer.rect(width*position, getParent().getY(),width, width);
			renderer.end();
			batch.begin();
		}
	}
	
	
	@Override
	public void show() {
		System.out.println("show");
		System.out.println(Gdx.graphics.getWidth()+","+Gdx.graphics.getHeight());
		stage = new Stage();
		container = new Table();
		
		skin = new Skin();
		
		Pixmap pixmap = new Pixmap(1,1,Format.RGBA8888);
		pixmap.setColor(Color.WHITE);
		pixmap.fill();
		
		
		skin.add("white", new Texture(pixmap));
		skin.add("default", new BitmapFont());
		
		
		LabelStyle labelStyle = new LabelStyle();
		labelStyle.font = skin.getFont("default");
		labelStyle.fontColor = Color.BLACK;
		skin.add("default", labelStyle);
		
		
		Table north = new Table();
		north.setBackground(skin.newDrawable("white", Color.BLUE));
		north.add(new ActionSlot(0, Color.BLUE));
		north.add(new ActionSlot(1, Color.RED));
		north.add(new ActionSlot(2, Color.YELLOW));
		north.add(new ActionSlot(3, Color.GREEN));
		Table south = new Table();
		south.add(new Label("South", skin));
		south.setBackground(skin.newDrawable("white", Color.RED));
		Table east = new Table();
		east.add(new Label("East", skin));
		east.setBackground(skin.newDrawable("white", Color.YELLOW));
		
		
		Table middle = new Table();
		
		Table center = new Table();
		center.add(new Label("Center", skin));
		center.setBackground(skin.newDrawable("white", Color.MAROON));
		
		middle.add(east).width(100);
		middle.add(center).expand().fill();
		
		east.row();
		east.add(new Label("East2", skin));
		
		container.add(north).expandX();
		container.row();
		container.add(middle).expand();
		container.row();
		container.add(south).expandX();
		container.setFillParent(true);
		stage.addActor(container);
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
