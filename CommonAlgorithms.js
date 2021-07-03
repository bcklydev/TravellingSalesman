function rectIsIntersecting(_r1x, _r1y, _r2x, _r2y, _r1w, _r2w) {
    if(((_r1x > (_r2x + _r2w)) || (_r2x > (_r1x + _r1w)))) {
        if((_r1y > (_r2y + _r2w)) || ((_r2y + _r2w) > (_r1y + _r1w))) {
            return false;
        }
    }
    else if((_r1y > (_r2y + _r2w)) || ((_r2y + _r2w) > (_r1y + _r1w))) {
        if(((_r1x > (_r2x + _r2w)) || (_r2x > (_r1x + _r1w)))) {
            return false;
        }
    }
    else {
        return true;
    }
}

function distanceBetweenPoints(_p1x, _p1y, _p2x, _p2y) {
    return Math.sqrt(Math.pow((_p1x-_p2x),2) + Math.pow((_p1y-_p2y),2));
}

function shuffleArray(array) {
    var currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

//Swaps two array items
function arraySwap(array, i, j) {
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

//Uses a lexicographic algorithm to move through all permutations one step at a time
function nextPermutation(_array) {
    largestI = -1;
    largestJ = -1;
    for(var i = 0; i < _array.length-1; i++) {
        if(_array[i] < _array[i+1]) {
            largestI = i;
        }
    }
    if(largestI == -1) {
        console.log("Finished");
        return _array;
    }
    for(var j = 0; j < _array.length; j++) {
        if(_array[largestI] < _array[j]) {
            largestJ = j;
        }
    }
    arraySwap(_array, largestI, largestJ);
    var tempArray = _array.splice(largestI + 1).reverse();
    //tempArray.reverse();
    _array.push.apply(_array, tempArray);

    return _array;
}

//Calculate factorial of a number
function factorial(num)
{
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}