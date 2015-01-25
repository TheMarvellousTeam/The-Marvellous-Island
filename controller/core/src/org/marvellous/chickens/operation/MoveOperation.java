package org.marvellous.chickens.operation;

public class MoveOperation extends CmdOperation{

	
	private String type = "move";
	public int x,y;
	
	public MoveOperation(int x, int y){
		this.x = x;
		this.y =y;
	}
	@Override
	public String getOpCode() {
		return "cmd";
	}

	@Override
	public void execute() {
	}

}
