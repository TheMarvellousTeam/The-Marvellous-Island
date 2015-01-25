package org.marvellous.chickens.operation;

import com.badlogic.gdx.utils.Json;
import com.badlogic.gdx.utils.JsonReader;
import com.badlogic.gdx.utils.JsonValue;
import com.badlogic.gdx.utils.JsonWriter.OutputType;

public class ChickenJSON {
	private static Json json = new Json();
	private static JsonReader reader = new JsonReader();
	static{
		json.setOutputType(OutputType.json);
	}
	
	
	public static String toJSON(Operation op){
		
		String args = "\"args\":"+ op.toJSON(json);
		return "{ \"op\":\""+op.getOpCode()+"\", "+args+"}";
	}
	
	public static Operation fromJSON(String str){
		JsonValue value = reader.parse(str);
		String op = value.getString("op");
		JsonValue args = value.get("args");
		
		//informations liees a l'operation
		String argsStr = "{";
		if(args.child != null){
			argsStr += args.child.toString();
		}
		argsStr += "}";
		
		if("name".equals(op)){
			return json.fromJson(CredentialsOp.class, argsStr);
		}
		if("new_turn".equals(op)){
			return json.fromJson(NewTurnOp.class, argsStr);
		}
		if("vibrate".equals(op)){
			return json.fromJson(VibrateOp.class, argsStr);
		}
		return null;
	}
}
