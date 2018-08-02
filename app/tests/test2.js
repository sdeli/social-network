var value;

function firstFn() {
    value = 3;
    secondFn();
} 

function secondFn(){
    value++
    console.log(value);
}

module.exports = firstFn;
