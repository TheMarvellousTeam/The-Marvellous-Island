package org.marvellous.chickens;

import java.io.IOException;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.InputProcessor;
import com.badlogic.gdx.Net.Protocol;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer.ShapeType;
import com.badlogic.gdx.net.Socket;
import com.badlogic.gdx.net.SocketHints;

public class TheMarvellousChickens extends ApplicationAdapter implements InputProcessor {
	private static final String SERVER_ADDR = "10.45.18.219";
	private static final int SERVER_PORT = 1984;
	
	SpriteBatch batch;
	ShapeRenderer renderer ;
	Socket socket;
	
	@Override
	public void create () {
		batch = new SpriteBatch();
		
		SocketHints hints = new SocketHints();
		hints.keepAlive=true;
		socket = Gdx.net.newClientSocket(Protocol.TCP, SERVER_ADDR, SERVER_PORT, hints);
		renderer = new ShapeRenderer();
		
		Gdx.input.setInputProcessor(this);

	}

	@Override
	public void render () {
		Gdx.gl.glClearColor(0, 0, 0, 0);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
		batch.begin();
		batch.end();
		renderer.begin(ShapeType.Line);
		int width =  Gdx.graphics.getWidth()/4 ;
		int height = Gdx.graphics.getHeight()/5;
		renderer.rect(0, 0, width, height);
		renderer.rect(width, 0, width, height);
		renderer.rect(2*width, 0, width, height);
		renderer.rect(3*width, 0, width, height);
		renderer.end();
	}

	@Override
	public boolean keyDown(int keycode) {

		return false;
	}

	@Override
	public boolean keyUp(int keycode) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean keyTyped(char character) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean touchDown(int screenX, int screenY, int pointer, int button) {
		try {
			socket.getOutputStream().write("Hello Python !".getBytes());
			System.out.println("message send "+socket.isConnected());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public boolean touchUp(int screenX, int screenY, int pointer, int button) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean touchDragged(int screenX, int screenY, int pointer) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean mouseMoved(int screenX, int screenY) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean scrolled(int amount) {
		// TODO Auto-generated method stub
		return false;
	}
}
