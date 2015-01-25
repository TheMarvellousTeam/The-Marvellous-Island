package org.marvellous.chickens;

public interface ChickenSocketListener {
	public void onReceive(String content);
	public void onConnexionError(String errorMessage);
}
