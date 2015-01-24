package org.marvellous.chickens;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Net.Protocol;
import com.badlogic.gdx.net.Socket;
import com.badlogic.gdx.net.SocketHints;
import com.badlogic.gdx.utils.GdxRuntimeException;

public class ChickenSocket {
	public  Socket socket;
	private SocketHints hints;
	private Thread thread;
	private String ip;
	private int port;
	private List<ChickenSocketListener> listeners;
	public ChickenSocket(){
		listeners = new ArrayList<ChickenSocketListener>();
		hints = new SocketHints();
	}
	
	public void connect(String ip, int port){
		hints.connectTimeout = 10000;
		hints.keepAlive = true;
		this.ip = ip;
		this.port = port;
		System.out.println("tentative de connexion...");
		try{
			socket = Gdx.net.newClientSocket(Protocol.TCP, ip, port, hints);
			System.out.println(socket.isConnected());
			thread = new Thread(){
				public void run(){
					while(true){
						byte[] b = new byte[512] ;
						try {
							while(true){
								if(socket.isConnected()){
								int read = socket.getInputStream().read(b);
								
								String content = new String(b, 0, read);
								if (content.startsWith("NEW_TURN"))
									System.out.println("prout !!");
								if(!content.isEmpty())
									for(ChickenSocketListener listener : listeners)
										listener.onReceive(content);
								}
							}
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
				}
			};
			thread.start();
		}catch(GdxRuntimeException gre){
			System.out.println(gre.getMessage());
			System.out.println(socket);
		}
	}
	public boolean isConnected(){
		return socket != null;
	}
	
	public void close(){
		System.out.println("before");
		thread.interrupt();
		System.out.println("that's fine dude.");
	}
	
	public void send(String content){
		try {
			socket.getOutputStream().write(content.getBytes());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public boolean sendIfConnected(String content){
		if(isConnected()){
			try {
				socket.getOutputStream().write(content.getBytes());
				return true;
			} catch (IOException e) {
				e.printStackTrace();
				return false;
			}
		}else
			return false;
	}
	
	public void addListener(ChickenSocketListener listener){
		listeners.add(listener);
	}
}
