statement -> booleanExpression  {% (d) => {return [toToken(d), "boolean"];} %}

booleanExpression -> booleanExpressionAtom {%posfix01%}
					| booleanExpression And booleanExpressionAtom {% posfix03 %}
        			| booleanExpression Or booleanExpressionAtom {% posfix03 %}
        			| booleanExpression Xor booleanExpressionAtom {% posfix03 %}
					| _ Not booleanExpressionAtom  {%posfix02%}
					
					| intExpression (Equal | NotEqual | GreaterThanEqual | Greater | LessThanEqual | Less) intExpression {% posfix03 %}
					
					| stringExpression (Equal | NotEqual) stringExpression {% posfix03%}
					
booleanExpressionAtom -> Bool {% posfix01 %}
					| Variable {% posfix01 %}
					| _ "(" booleanExpression ")"  _ {% posfixP %}
					| _ isEmpty _ "(" stringExpression ")" _ {% posfixP2 %}
					
					
intExpression -> intExpressionAtom {%posfix01%}
				| intExpressionAddAndSub
				
intExpressionAddAndSub -> intExpressionMulAndDiv {% id %}
						| intExpressionAddAndSub ("+" | "-") intExpressionMulAndDiv {% posfix03 %}

intExpressionMulAndDiv -> intExpressionMod {% id %}
						| intExpressionMulAndDiv ("*" | "/") intExpressionMod {% posfix03 %}
				
intExpressionMod -> intExpressionAtom {% id %}
					| intExpressionMod "%" intExpressionAtom {% posfix03 %}
					
intExpressionAtom -> Int {% posfix01 %}
				| Variable {% posfix01 %}
				| _ "(" intExpression ")"  _ {% posfixP %}
					
stringExpression -> String {% posfix01 %}
					| Variable {% posfix01 %}
					| _ append _ "(" stringExpression  "," stringExpression ")" _ {% posfixP3 %}
        			| _ substr _ "(" stringExpression "," intExpression "," intExpression ")" _ {% posfixP4 %}

				


Variable -> _ [a-zA-Z_] [a-zA-Z0-9_]:* _ {%
	function (d, l, reject) {
		const name = [d[1], d[2].join("")].join("")
		const CONSTANTS = [
			"True",
			"False",
			"isEmpty",
			"append",
			"substr",
			"and",
			"or",
			"xor"
		];
		if (CONSTANTS.includes(name))
		return reject;
		return name;
	} %}
Bool -> _  ("True" | "False") _ {% function (d) { return d[1].join("");} %}
Int -> _ [0-9]:+ _ {% function (d) { return d[1].join("");} %}

String -> _ sqstring _{% function(d) {return d[1]; } %} 
      | _ dqstring _ {% function(d) {return  d[1]; } %} 


dqstring -> "\"" dstrchar:* "\""  {% function(d) {return "'" + d[1].join("") + "'"; } %} 
sqstring -> "'"  sstrchar:* "'"  {% function(d) {return "'" + d[1].join("") + "'" } %} 

dstrchar -> [^\\"\\'\n] {% id %}
    | "\\" strescape {%
    function(d) {
        return JSON.parse("\""+d.join("")+"\"").toString();
    }
     %}
    | "'" {%
      function(d) {
        return "\"";
      }
    %}
    | "\\" {% id %}
sstrchar -> [^\\'\n] {% id %}
    | "\\" strescape
        {% function(d) { return JSON.parse("\""+d.join("")+"\""); } %}
    | "\\'"
        {% function(d) {return "\""; } %}
    | "\\" {% id %}

strescape -> ["\\/bfnrt] {% id %}
    | "u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] {%
    function(d) {
        return d.join("");
    }
%}

#Operator 
isEmpty -> "isEmpty"
append -> "append"
substr -> "substr"
Equal ->   "=" 
NotEqual ->  "<>" 
Less  ->  "<" 
LessThanEqual ->  "<=" 
Greater ->  ">" 
GreaterThanEqual ->  ">=" 
And ->  space "and" space {%(d) => "and"%}
Or ->  space "or" space {%(d) =>  "or"%}
Not ->  "not" space {%(d) =>  "!"%}
Xor -> space "xor" space {%(d) =>  "xor"%}


_ -> [\s]:* {% 
	function (d) {
		    return null;
    }
%}

space -> [\s]  {%
    function (d) {
        return null;
    }
%}


@{%

   function translate(key) {
        key = key.toString();
        switch (key) {
            case "and":
                return "&&";
            case "or":
                return "||";
            case "=" : 
                return "==";
            case "xor": 
                return "^";
            case "<>":
                return "!=";
            default:
                return key;
        }
    }

    function toToken(d) {
        return d.join("");
    }
    function posfixP(d) {
        return d[2];
    }
    function posfix01(d) {
        return translate(d[0]);
    }

    function posfix02(d) {
        return [d[2], d[1]].join(" ");
    }

    function posfix03(d) {
        return [d[0],d[2],translate(d[1])].join(" ");
    }
   
    function posfixP4(d) {
        return [translate(d[4]), translate(d[6]), d[8], d[1]].join(" ");
    }
    function posfixP3(d) {
        
        return [translate(d[4]), d[6], d[1]].join(" ");
    }
    function posfixP2(d) {
        return [d[4], d[1]].join(" ");
    }
%}