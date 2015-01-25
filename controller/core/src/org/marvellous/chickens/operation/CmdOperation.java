package org.marvellous.chickens.operation;

import com.badlogic.gdx.utils.JsonValue;

public class CmdOperation extends Operation{

	
	public String type;
	public int x,y;
	
	public CmdOperation(String type){
		this.type = type;
	}
	@Override
	public String getOpCode() {
		return "cmd";
	}

	@Override
	public void execute() {
		
	}
	

}
