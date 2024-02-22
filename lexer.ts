export enum TokenType {
  Number,
  Identifier,
  Equal,
  OpenParen,
  CloseParen,
  BinaryOperator,
  funOpenParen,
  funCloseParen,
  reservedWords,
  comma,
  semicolon
}
export const reservedWords = {
  global: "globObj",
  if: "ifFunc",
  return: "return ",
  while: "whileFunc",
  for: "forFunc",
  arguments: "arguments",
  c : "createArray",
  EOF: "EOF",
  LOG: "console.log",
};
export interface Token {
  value: string;
  type: TokenType;
}
function validVar(char: string) {
  return char.match(/^[a-z]([0-9]*[a-z]*)*$/i);
}
function validNum(char: string) {
  return char.match(/^\d+\.*\d*$/i);
}
export function tokenizer(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");
  while (src.length > 0) {
    if (src[0] === "\n" || src[0] === "\t" || src[0] === "\r") {
      src.shift();
      continue;
    }
    switch (true) {
      case src[0] === " ":
        src.shift();
        break;
      case src[0] === "(":
        tokens.push({ value: "(", type: TokenType.OpenParen });
        src.shift();
        break;
      case src[0] === ")":
        tokens.push({ value: ")", type: TokenType.CloseParen });
        src.shift();
        break;
      case src[0] === "=":
        tokens.push({ value: "=", type: TokenType.Equal });
        src.shift();
        break;
      case src[0] === ",":
        tokens.push({ value: ",", type: TokenType.comma });
        src.shift();
        break;
      case src[0] === "+":
      case src[0] === "-":
      case src[0] === "*":
      case src[0] === "/":
      case src[0] === "%":
        tokens.push({ value: src[0], type: TokenType.BinaryOperator });
        src.shift();
        break;
      case src[0] === ";":
        tokens.push({ value: ";", type: TokenType.semicolon });
        src.shift();
        break;
      default: {
        if (validNum(src[0])) {
          let num = "";
          while (validNum(num + src[0]) && src[0] !== " ") {
            num += src.shift();
          }
          tokens.push({ value: num, type: TokenType.Number });
        } else if (validVar(src[0])) {
          let varName = "";
          while (validVar(varName + src[0]) && src[0] != undefined) {
            varName += src[0];
            src.shift();
          }
          if (reservedWords[varName] === undefined) {
            tokens.push({ value: varName, type: TokenType.Identifier });
          } else {
            tokens.push({ value: varName, type: TokenType.reservedWords });
          }
        } else if (src[0] === "<") {
          if (src[1] === "<") {
            tokens.push({ value: "<", type: TokenType.BinaryOperator });
            src.shift();
            src.shift();
          } else if (src[1] === "=") {
            tokens.push({ value: "<=", type: TokenType.BinaryOperator });
          } else {
            tokens.push({ value: "(", type: TokenType.funOpenParen });
            src.shift();
          }
        } else if (src[0] === ">") {
          if (src[1] === ">") {
            tokens.push({ value: ">", type: TokenType.BinaryOperator });
            src.shift();
            src.shift();
          } else if (src[1] === "=") {
            tokens.push({ value: ">=", type: TokenType.BinaryOperator });
          } else {
            tokens.push({ value: ")", type: TokenType.funCloseParen });
            src.shift();
          }
        }
      }
    }
  }
  return tokens;
}
