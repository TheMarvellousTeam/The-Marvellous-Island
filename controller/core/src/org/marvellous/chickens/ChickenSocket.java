package org.marvellous.chickens;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Net.Protocol;
import com.badlogic.gdx.net.Socket;
import com.badlogic.gdx.net.SocketHints;

public class ChickenSocket {
	public final Socket socket;
	private SocketHints hints;
	private Thread thread;
	public final String ip;
	public final int port;
	private List<ChickenSocketListener> listeners;
	private volatile boolean running; 
	public ChickenSocket(String ip, int port){
		running = false;
		listeners = new ArrayList<ChickenSocketListener>();
		hints = new SocketHints();
		hints.keepAlive = true;
		this.ip = ip;
		this.port = port;
		socket = Gdx.net.newClientSocket(Protocol.TCP, ip, port, hints);
		thread = new Thread(){
			public void run(){
				while(running){
					byte[] b = new byte[512] ;
					try {
						while(true){
							socket.getInputStream().read(b) ;
							String content = new String(b);
							if(!content.isEmpty())
							for(ChickenSocketListener listener : listeners)
								listener.onReceive(content);
						}
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
		};
	}
	
	public void start(){
		running = true;
		thread.start();
	}
	
	public void close(){
		running = false;
		try {
			thread.join();
			System.out.println("that's fine dude.");
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
	}
	
	public void send(String content){
		try {
			socket.getOutputStream().write(content.getBytes());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void addListener(ChickenSocketListener listener){
		listeners.add(listener);
	}
}
