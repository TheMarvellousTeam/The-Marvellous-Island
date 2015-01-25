package org.marvellous.chickens.operation;

public class CredentialsOp extends Operation{
	public String name;
	private int id;
	public CredentialsOp(){
		
	}
	public CredentialsOp(String name) {
		this.name = name;
		id = 5;
	}
	@Override
	public String getOpCode() {
		return "name";
	}
	@Override
	public void execute() {
	}


}
