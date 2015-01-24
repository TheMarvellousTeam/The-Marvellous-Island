package org.marvellous.chickens;

import java.io.IOException;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.InputProcessor;
import com.badlogic.gdx.Net.Protocol;
import com.badlogic.gdx.net.Socket;
import com.badlogic.gdx.net.SocketHints;

public class TheMarvellousChickens extends ApplicationAdapter implements InputProcessor {
	private static final String SERVER_ADDR = "10.45.18.219";
	private static final int SERVER_PORT = 1984;
	
	TestSocketInput input ;
	
	@Override
	public void create () {
		
		SocketHints hints = new SocketHints();
		hints.keepAlive=true;
		final Socket socket = Gdx.net.newClientSocket(Protocol.TCP, SERVER_ADDR, SERVER_PORT, hints);
		
		new Thread(new Runnable() {
			@Override
			public void run() {
				byte[] b = new byte[512] ;
				try {
					while(true){
						socket.getInputStream().read(b) ;
						String action = new String(b);
						System.out.println(action);
					}
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}).start();
		
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
		char zero = 0;
		String endOfInput = new StringBuilder().append(zero).append(zero).append(zero).append(zero).toString();
		Gdx.input.getTextInput(input, "Socket", "Let's test that shit madafaka !"+endOfInput, null);
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
