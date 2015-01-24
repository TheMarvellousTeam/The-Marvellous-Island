package org.marvellous.chickens;

import java.io.IOException;

import com.badlogic.gdx.Input.TextInputListener;
import com.badlogic.gdx.net.Socket;

public class TestSocketInput implements TextInputListener {

	Socket socket ;
	
	public TestSocketInput(Socket socket) {
		this.socket = socket ;
	}
	
	@Override
	public void input(String text) {
		try {
			socket.getOutputStream().write(text.getBytes());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void canceled() {

	}

}
