package org.marvellous.chickens.operation;

import org.marvellous.chickens.TheMarvellousChickens;

import com.badlogic.gdx.Gdx;

public class VibrateOp extends Operation{

	@Override
	public String getOpCode() {
		return "vibrate";
	}

	@Override
	public void execute(TheMarvellousChickens game) {
		Gdx.input.vibrate(1000);
	}

}
