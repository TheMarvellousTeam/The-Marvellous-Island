package org.marvellous.chickens;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.InputProcessor;

public class TheMarvellousChickens extends ApplicationAdapter implements InputProcessor {
	private static final String SERVER_ADDR = "10.45.18.219";
	private static final int SERVER_PORT = 1984;
	private ChickenSocket socket;
	TestSocketInput input ;
	@Override
	public void create () {
		socket = new ChickenSocket(SERVER_ADDR, SERVER_PORT);
		socket.addListener(new ChickenSocketListener() {
			
			@Override
			public void onReceive(String content) {
				System.out.println("The chicken says : " + content);
			}
		});
		socket.start();
		Gdx.input.setInputProcessor(this);

	}


	@Override
	public void render () {
		
	}

	@Override
	public boolean keyDown(int keycode) {
		socket.close();
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
		char zero = 0;
		String endOfInput = new StringBuilder().append(zero).append(zero).append(zero).append(zero).toString();
		//Gdx.input.getTextInput(input, "Socket", "Let's test that shit madafaka !"+endOfInput, null);
		socket.send("trololo");
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
