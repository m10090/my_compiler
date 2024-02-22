
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

let x=7;let y=6;let hos=43234;ifFunc(function () {return (x>y);},function () {console.log(hos);},function () {console.log(234);})
