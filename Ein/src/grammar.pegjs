start = Expression

Expression
  = head:Atom tail:((OneWhitespace Atom) /(_ DataType))* {
      var result = [head], i;
      for (i = 0; i < tail.length; i++) {
        result.push(tail[i][1]);
      }
    return result}
  / head:DataType tail:(_ DataType)* {
      var result = [head], i;
      for (i = 0; i < tail.length; i++) {
        result.push(tail[i][1]);
      }
    return result}

SExpression
  = "(" _ expr:(Expression/_) _ ")" {
      return {
        type: "S-Expression",
        data: expr,
        location: location()
      };}

DataType =
	Set
  / Vector
  / Map
  / SExpression

Atom =
    Nil
  / Boolean
  / Character
  / Integer
  / String
  / Keyword
  / Symbol

Character "Character"
 = "\\" sym:[-+*/!@%^&=.a-zA-Z0-9_]+ {
   return {
            type: "Character",
            data: sym,
            location: location()
          };
 }

Boolean "Boolean"
 = bool:"true" {
     return {
            type: "Boolean",
            data: true,
            location: location()
          };
     }
  / bool: "false" {
    return {
            type: "Boolean",
            data: false,
            location: location()
          };
  }

Nil "Nil"
 = "nil" {
 	return {
        type: "Nil",
        data: "nil",
        location: location()
      };
 }

Set "Set"
 = "#{" _ expr:(Expression/_) _ "}" {
 	return {
        type: "Set",
        data: expr,
        location: location()
      };
 }

Vector "Vector"
  = "[" _ expr:(Expression/_) _ "]" {
    return {
        type: "Vector",
        data: expr,
        location: location()
      };
    }

MapPair "MapPair"
 = d1:(Atom/DataType) _ ":" _ d2:(Atom / DataType) {
 	return {
        type: "MapPair",
        data: [d1, d2],
        location: location()
      };
 }

MapExpression "MapExpression"
 = head:MapPair tail:((OneWhitespace+/",") _ MapPair)* {
  var result = [head], i;
      for (i = 0; i < tail.length; i++) {
        result.push(tail[i][2]);
      }
      return result;
 }

Map "Map"
 = "{" _ expr:(MapExpression)* _  "}" {
  return {
        type: "Map",
        data: expr,
        location: location()
      };
 }

Integer "Numeric"
  = "-"?[0-9]+("."[0-9]+)? {
  return {
    type: "Numeric",
    data: parseFloat(text(), 10),
    location: location()
    }
  }

Keyword "Keyword"
 = ":" sym:[-+*/!@%^&=.a-zA-Z0-9_]+{
  return {
    type: "Keyword",
    data: ":" + sym.join(''),
    location: location()
    }
  }

String "String"
 = "\"" sym:[-+*/!@%^&=.a-zA-Z0-9_]* "\""{
  return {
    type: "String",
    data: sym.join(''),
    location: location()
    }
  }

Symbol "Symbol"
  = sym:[-+*/!@%^&=.a-zA-Z0-9_]+ {
  return {
    type: "Symbol",
    data: sym.join(''),
    location: location()
    }
  }

OneWhitespace "whitespace"
  = [ \t\n\r]+

_ "whitespace"
  = [ \t\n\r]*
