import { TokenType, Token, Tokens } from "./lexer.ts";

type StamentType =
  | "Condition"
  | "Decleration"
  | "FuncStatment"
  | "FuncCall"
  | "Perentheses";

// copilot built a interface for me that parse tokens and save the start and end index of the tokens
interface ParseTree {
  type: StamentType;
  start: number;
  end: number;
  children: ParseTree[];
}
interface FnStatment extends ParseTree {
  type: "FuncStatment";
  prams: string[];
  start: number;
  end: number;
  children: ParseTree[];
}

let head: ParseTree[] = [];
function parse(i: number): [ParseTree[], number] {
  const children: ParseTree[] = [];
  if (Tokens[i].type === TokenType.semicolon){
    return [children, i];
  }
  else if (Tokens[i].type === TokenType.fnOpenParen) {
    const [child, newIndex] = FuncStatment(i);
    i = newIndex;
    children.push(child);
  } else if (Tokens[i].type === TokenType.Identifier) {
    const [child, newIndex] = Varibles(i);
    i = newIndex;
    children.push(child);
  } else if (Tokens[i].type === TokenType.OpenParen) {
    const [child, newIndex] = Paren(i);
    i = newIndex;
    children.push(child);
  } else if (Tokens[i].type === TokenType.reservedWords) {
    const [child, newIndex] = parse(i + 1);
    i = newIndex;
    children.push(...child);
  }
  else if (Tokens[i].type === TokenType.Number) {
    const [child, newIndex] = parse(i + 1);
    i = newIndex;
    children.push(...child);
     
  }
  else {
    console.log(i, Tokens[i]);
    throw Error("Unknow char");
  }
  return [children, i];
}
function FuncStatment(i: number): [FnStatment, number] {
  const startIndex = i;
  const prams: string[] = [];
  const children: ParseTree[] = [];
  if (Tokens[i].type === TokenType.fnOpenParen) {
    if (Tokens[i + 1].type === TokenType.OpenParen) {
      const [_prams, nextIndex] = getFunctionPrams(i + 1);
      i = nextIndex;
      prams.push(..._prams);
    }
    do {
    const [_children, nextIndex] = parse(i + 1);
      i = nextIndex;
    children.push(..._children);
    } while (Tokens[i+1].type !== TokenType.fnCloseParen && Tokens[i].type === TokenType.semicolon);
    i+=1
    console.log(Tokens[i]); 

    if (Tokens[i].type === TokenType.fnCloseParen) {
      return [
        {
          type: "FuncStatment",
          start: startIndex,
          prams,
          end: i,
          children,
        },
        i,
      ];
    }
  }
  console.log("error in FuncStatment");
  throw Error("Invalid FuncStatment");
}
function Varibles(i: number): [ParseTree, number] {
  // write with sorting of i
  const startIndex = i;
  if (Tokens[i].type === TokenType.Identifier) {
    if (Tokens[i + 1].type === TokenType.Equal) {
      if (
        Tokens[i + 2].type === TokenType.string ||
        Tokens[i + 2].type === TokenType.Number ||
        Tokens[i + 2].type === TokenType.Identifier ||
        Tokens[i + 2].type === TokenType.OpenParen ||
        Tokens[i + 2].type === TokenType.reservedWords
      ) {
        const [children, newIndex] = parse(i + 3);
        i = newIndex;
        return [
          {
            type: "Decleration",
            start: startIndex,
            end: i,
            children,
          },
          i,
        ];
      }
      if (Tokens[i + 2].type === TokenType.fnOpenParen) {
        const [children, newIndex] = parse(i + 2);
        i = newIndex;
        return [
          {
            type: "Decleration",
            start: startIndex,
            end: i,
            children,
          },
          i,
        ];
      }
    }
  }

  if (
    Tokens[i].type === TokenType.Identifier ||
    Tokens[i].type === TokenType.reservedWords ||
    Tokens[i].type == TokenType.Number ||
    Tokens[i].type === TokenType.string
  ) {
    if (
      Tokens[i + 1].type === TokenType.Equal &&
      Tokens[i + 2].type === TokenType.Equal
    ) {
      const [children, newIndex] = parse(i + 3);
      i = newIndex + 1;
      return [
        {
          type: "Condition",
          start: startIndex,
          end: newIndex,
          children,
        },
        newIndex,
      ];
    } else if (Tokens[i + 1].type === TokenType.BinaryOperator) {
      const [children, newIndex] = parse(i + 3);
      i = newIndex + 1;
      return [
        {
          type: "Condition",
          start: startIndex,
          end: newIndex,
          children,
        },
        newIndex,
      ];
    }
  }
  console.log("error in Decleration");
  throw (Error("Invalid Decleration"), process.exit(1));
}
function Paren(i: number): [ParseTree, number] {
  const startIndex = i;
  const [_children, nextIndex] = parse(i + 1);
  if (Tokens[nextIndex].type === TokenType.CloseParen)
    return [
      {
        type: "Perentheses",
        start: startIndex,
        end: nextIndex,
        children: _children,
      },
      i,
    ];
  throw (Error("Invalid Paren"), process.exit(1));
}
function getFunctionPrams(i: number): [string[], number] {
  const prams: string[] = [];
  while (Tokens[i].type !== TokenType.CloseParen) {
    if (Tokens[i].type === TokenType.Identifier) {
      prams.push(Tokens[i].value);
    }
    i++;
  }
  return [prams, i];
}
console.log(Tokens.slice(12));
let l = -1;
while (l < Tokens.length - 1) {
  const [node, next] = parse(l + 1);
  l = next;
  head.push(...node);
}
console.log(head);
