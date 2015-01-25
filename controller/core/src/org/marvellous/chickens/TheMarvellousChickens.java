package org.marvellous.chickens;

import org.marvellous.chickens.operation.ChickenJSON;
import org.marvellous.chickens.operation.CredentialsOp;
import org.marvellous.chickens.operation.Operation;
import org.marvellous.chickens.screens.ControllerScreen;
import org.marvellous.chickens.screens.MenuScreen;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.InputProcessor;
import com.badlogic.gdx.utils.Json;

public class TheMarvellousChickens extends Game implements InputProcessor {
	private ChickenSocket socket;
	TestSocketInput input ;
	private MenuScreen menuScreen;
	private ControllerScreen controllerScreen;
	
	
	@Override
	public void create () {
		
		Operation creds = new CredentialsOp("Simon");
		Json json = new Json();
		System.out.println(ChickenJSON.toJSON(creds));
		
		
		socket = new ChickenSocket();
		socket.addListener(new ChickenSocketListener() {
			@Override
			public void onReceive(String content) {
				Operation op = ChickenJSON.fromJSON(content);
				if(op == null){
					System.err.println("commande inconnue : " + content);
				}else{
					op.execute(TheMarvellousChickens.this);
				}
			}

			@Override
			public void onConnexionError(String errorMessage) {
				System.err.println("error : " + errorMessage);
			}
		});
		menuScreen = new MenuScreen(this);
		controllerScreen = new ControllerScreen(this);
		setScreen(menuScreen);
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
	
	public MenuScreen getMenuScreen(){
		return menuScreen;
	}
	
	public ControllerScreen getControllerScreen(){
		return controllerScreen;
	}
}
