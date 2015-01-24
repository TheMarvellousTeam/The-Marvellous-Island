package org.marvellous.chickens;

import org.marvellous.chickens.screens.MenuScreen;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.InputProcessor;

public class TheMarvellousChickens extends Game implements InputProcessor {
	private ChickenSocket socket;
	TestSocketInput input ;
	private MenuScreen menuScreen;
	
	@Override
	public void create () {
		resize(800, 480);
		socket = new ChickenSocket();
		socket.addListener(new ChickenSocketListener() {
			@Override
			public void onReceive(String content) {
				System.out.println("The chicken says : '" + content+"'");
				
			}

			@Override
			public void onConnexionError(String errorMessage) {
				System.err.println("error : " + errorMessage);
			}
		});
		setScreen(new MenuScreen(this));
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
		char zero = 0;
		String endOfInput = new StringBuilder().append(zero).append(zero).append(zero).append(zero).toString();
		//Gdx.input.getTextInput(input, "Socket", "Let's test that shit madafaka !"+endOfInput, null);
		//socket.send("trololo");
		//socket.close();
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
	public ChickenSocket getSocket(){
		return socket;
	}
}
