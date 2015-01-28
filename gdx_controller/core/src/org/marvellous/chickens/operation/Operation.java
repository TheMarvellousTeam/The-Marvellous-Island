package org.marvellous.chickens.operation;

import org.marvellous.chickens.TheMarvellousChickens;

import com.badlogic.gdx.utils.Json;

public abstract class Operation {
	
	
	public String toJSON(Json json){
		return json.toJson(this);
	}
	public abstract String getOpCode();
	public abstract void execute(TheMarvellousChickens game);
}
