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
	
	Socket socket;
	
	TestSocketInput input ;
	
	@Override
	public void create () {
		
		SocketHints hints = new SocketHints();
		hints.keepAlive=true;
		socket = Gdx.net.newClientSocket(Protocol.TCP, SERVER_ADDR, SERVER_PORT, hints);
		
		input = new TestSocketInput(socket);
		
		Gdx.input.setInputProcessor(this);

	}

	@Override
	public void render () {
		
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
		Gdx.input.getTextInput(input, "Socket", "Let's test that shit madafaka !", null);
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
