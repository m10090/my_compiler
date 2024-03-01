export enum TokenType {
  Number,
  Identifier,
  Equal,
  OpenParen,
  CloseParen,
  BinaryOperator,
  fnOpenParen,
  fnCloseParen,
  reservedWords,
  comma,
  semicolon,
  string,
  dot,
  EOF
}
export const reservedWords = {
  global: "globObj",
  if: "ifFunc",
  return: "return ",
  while: "whileFunc",
  for: "forFunc",
  c: "createArray",
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
export function Tokenizer(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");
  while (src.length > 0) {
    if (
      src[0] === "\n" ||
      src[0] === "\t" ||
      src[0] === "\r" ||
      src[0] === " "
    ) {
      src.shift();
      continue;
    }
    switch (true) {
      case src[0] === "(":
        tokens.push({ value: "(", type: TokenType.OpenParen });
        src.shift();
        break;
      case src[0] === ")":
        tokens.push({ value: ")", type: TokenType.CloseParen });
        src.shift();
        break;
      // equal case which is used for assignment and comparison see ast.ts
      case src[0] === "=":
        tokens.push({ value: "=", type: TokenType.Equal });
        src.shift();
        break;
      case src[0] === ",":
        tokens.push({ value: ",", type: TokenType.comma });
        src.shift();
        break;
      case src[0] === ".":
        tokens.push({ value: ".", type: TokenType.dot });
        src.shift();
        break;
      // string case
      case src[0] === "'": {
        let str = "";
        src.shift();
        while (src[0] !== "'") {
          if (src.length === 0) throw new Error("Invalid string");
          if (src[0] === "\\") str += src.shift();
          str = str + src.shift();
        }
        src.shift();
        tokens.push({ value: str, type: TokenType.string });
        break;
      }
      case src[0] === '"': {
        let str = "";
        src.shift();
        while (src[0] !== '"') {
          if (src[0] === "\\") str += src.shift();

          str = str + src.shift();
        }
        src.shift();
        tokens.push({ value: str, type: TokenType.string });
        break;
      }
      case src[0] === "&":
      case src[0] === "|":
      case src[0] === "!":
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
          while (validVar(varName + src[0]) && src[0]) {
            varName += src.shift();
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
            tokens.push({ value: "(", type: TokenType.fnOpenParen });
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
            tokens.push({ value: ")", type: TokenType.fnCloseParen });
            src.shift();
          }
        }
      }
    }
  }
  return tokens;
}
// get Path from command line
const fileName = process.argv[2];
const fs = require("fs");
console.log(fileName)
const sourceCode = fs.readFileSync(fileName, "utf8");
export const Tokens = Tokenizer(sourceCode);
