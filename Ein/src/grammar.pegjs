start = Expression

Expression
  = head:Atom tail:((OneWhitespace Atom) /(_ SExpression))* {
      var result = [head], i;
      for (i = 0; i < tail.length; i++) {
        result.push(tail[i][1]);
      }
    return result}
  / head:SExpression tail:(_ SExpression)* {
      var result = [head], i;
      for (i = 0; i < tail.length; i++) {
        result.push(tail[i][1]);
      }
    return result}

SExpression
  = "(" _ expr:Expression _ ")" {
      return {
        type: "S-Expression",
        data: expr,
        location: location()
      };}

Atom =
    Integer
  / Symbol

Integer "Numeric"
  = "-"?[0-9]+("."[0-9]+)? {
  return {
    type: "Numeric",
    data: parseFloat(text(), 10),
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
