package org.marvellous.chickens.operation;

import org.marvellous.chickens.TheMarvellousChickens;

public class NewTurnOp extends Operation{

	@Override
	public String getOpCode() {
		return "new_turn";
	}

	@Override
	public void execute(TheMarvellousChickens game) {
		game.getControllerScreen().clearCommands();
	}

}
