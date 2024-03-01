import { TokenType, Tokenizer, reservedWords, Token } from "./lexer";

let js = `
  function ifFunc(expression, ifTrue, ifFalse) {
    if (expression()) {
      ifTrue();
    } else {
      ifFalse();
    }
  }
  function createArray(){
    return arguments;
  }
  function whileFunc(expression, body) {
    while (expression()) {
      body();
    }
  }

`;
const def = new Set();
export default function compile(src: string) {
  const tokens = Tokenizer(src);
  tokens.forEach((token: Token) => {
    switch (token.type) {
      case TokenType.Identifier:
        if (def.has(token.value)) {
          js += token.value;
        } else {
          js += "let " + token.value;
          def.add(token.value);
        }
        break;
      case TokenType.Equal:
        js += "=";
        break;
      case TokenType.OpenParen:
        js += "(";
        break;
      case TokenType.CloseParen:
        js += ")";
        break;
      case TokenType.BinaryOperator:
        js += token.value;
        break;
      case TokenType.fnOpenParen:
        js += "function () {";
        break;
      case TokenType.fnCloseParen:
        js += "}";
        break;
      case TokenType.reservedWords:
        js += reservedWords[token.value];
        break;
      case TokenType.comma:
        js += ",";
        break;
      case TokenType.semicolon:
        js += ";";
        break;
      case TokenType.Number:
        js += token.value;
        break;
    }
  });
  return js;
}
