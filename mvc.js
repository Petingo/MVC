function getInterior(points, width, height) {

    let interiorMap = new Array(height).fill(0).map(() => new Array(width).fill(0));

    points.forEach(elem => {
        interiorMap[elem[0]][elem[1]] = 1;
    })
    for (let i = 0; i < points.length; i++) {

        let y1 = points[i][0];
        let x1 = points[i][1];

        let y2 = points[i + 1 == points.length ? 0 : i + 1][0];
        let x2 = points[i + 1 == points.length ? 0 : i + 1][1];

        if (x1 == x2) {

            let yMin = Math.min(y1, y2) + 1;
            let yMax = Math.max(y1, y2) - 1;

            for (let yt = yMin; yt <= yMax; yt++) {
                interiorMap[yt][x1] = 1;
            }
        }
        else {
            // y = ax + b
            let a = (1.0 * (y1 - y2) / (x1 - x2));
            let b = y1 - a * x1;

            let yMin = Math.min(y1, y2) + 1;
            let yMax = Math.max(y1, y2) - 1;

            for (let yt = yMin; yt <= yMax; yt++) {
                xt = Math.round((yt - b) / a);
                if (xt < 0 || xt > width) {
                    continue;
                }
                interiorMap[yt][xt] = 1;
            }
        }
    }

    let interiorList = [];
    let interiorListTmp = [];
    let flag = false;
    for (let i = 0; i < height; i++) {
        flag = false;
        interiorListTmp = [];
        for (let k = 0; k < width; k++) {
            if (interiorMap[i][k] != 0) {
                interiorListTmp.push([i, k]);
                if (flag) {
                    flag = false;
                    interiorList = interiorList.concat(interiorListTmp);
                    break;
                }
                else {
                    flag = true;
                }
            }
            else {
                if (flag) {
                    interiorListTmp.push([i, k]);
                }
            }
        }
    }
    // console.log(interiorList)
    // interiorList.forEach(elem => {
    //     console.log(elem[0], elem[1])
    //     interiorMap[elem[0]][elem[1]] = 2
    // })

    // console.log(interiorList)
    return interiorList;
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function angle(a, b, c) {
    length_a = distance(b, c);
    length_b = distance(a, c);
    length_c = distance(a, b);
    return Math.acos((Math.pow(length_b, 2) + Math.pow(length_c, 2) - Math.pow(length_a, 2)) / (2 * length_b * length_c));
}

function sum(array) {
    let total = 0;
    for (let i = 0; i < array.length; i++) {
        total += array[i];
    }
    return total;
}

function getMeanValueCoordinates(boundary, x) {
    let meanValueCoordinates = [];
    let boundaryWeight = [];
    let previous, next, current;
    let angle1, angle2;

    for (i = 0; i < boundary.length; i++) {
        previous = boundary[i == 0 ? boundary.length - 1 : i - 1];
        next = boundary[i == boundary.length - 1 ? 0 : i + 1];
        current = boundary[i];
        angle1 = angle(x, next, current);
        angle2 = angle(x, current, previous);
        boundaryWeight.push((Math.tan(angle1 / 2) + Math.tan(angle2 / 2)) / distance(current, x));
    }

    let totalWeight = sum(boundaryWeight);

    for (i = 0; i < boundary.length; i++) {
        meanValueCoordinates.push(boundaryWeight[i] / totalWeight);
    }

    return meanValueCoordinates;
}

function calculateIndex(y, x, width) {
    return (width * y + x) * 4;
}

function getDifference(source, target, sourceWidth, targetWidth, offsetY, offsetX, boundary) {
    let differenceR = [], differenceG = [], differenceB = [];
    let indexS, indexT;

    for (let i = 0; i < boundary.length; i++) {
        indexS = calculateIndex(boundary[i][0], boundary[i][1], sourceWidth);
        indexT = calculateIndex(boundary[i][0] + offsetY, boundary[i][1] + offsetX, targetWidth);
        differenceR.push(target[indexT] - source[indexS]);
        differenceG.push(target[indexT + 1] - source[indexS + 1]);
        differenceB.push(target[indexT + 2] - source[indexS + 2]);
    }
    let difference = [differenceR, differenceG, differenceB];
    return difference;
}

function composite(source, target, sourceWidth, sourceHeight, targetWidth, targetHeight, offsetY, offsetX, boundary) {
    let interior = getInterior(boundary, sourceWidth, sourceHeight)
    
    let difference = getDifference(source, target, sourceWidth, targetWidth, offsetY, offsetX, boundary)
    let meanValue = [];

    // r(x) respectively for R, G, B.
    let rR, rG, rB, indexS, indexT;
    for (let i = 0; i < interior.length; i++) {
        meanValue = getMeanValueCoordinates(boundary, interior[i]);
        // console.log(interior[i])
        rR = 0;
        rG = 0;
        rB = 0;
        for (let j = 0; j < meanValue.length; j++) {
            rR += meanValue[j] * difference[0][j];
            rG += meanValue[j] * difference[1][j];
            rB += meanValue[j] * difference[2][j];
            // console.log(rR, rG, rB);
        }
        indexS = calculateIndex(interior[i][0], interior[i][1], sourceWidth);
        indexT = calculateIndex(interior[i][0] + offsetY, interior[i][1] + offsetX, targetWidth);
        target[indexT] = source[indexS] + rR;
        target[indexT + 1] = source[indexS + 1] + rG;
        target[indexT + 2] = source[indexS + 2] + rB;
    }
    return target
}

/* let vertices = [[0, 0], [-200, -50], [-100, 150], [50, 200], [-100, 100]];
let x = [40, 20];

console.log(calculateCoordinates(vertices, x)); */