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

function permute(permutation) {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;
  
    while (i < length) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = permutation[i];
        permutation[i] = permutation[k];
        permutation[k] = p;
        ++c[i];
        i = 1;
        result.push(permutation.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    return result;
  }