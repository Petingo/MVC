function polarSort(points){
    let yMax = -1, yMin = 1e9
    for(let i = 0 ; i < points.length ; i++){
        yMax = Math.max(yMax, points[i][0])
        yMin = Math.min(yMin, points[i][0])
    }

    let xMax = -1, xMin = 1e9
    for(let i = 0 ; i < points.length ; i++){
        xMax = Math.max(xMax, points[i][1])
        xMin = Math.min(xMin, points[i][1])
    }

    let centerY = (yMax + yMin) / 2.
    let centerX = (xMax + xMin) / 2.

    let angles = {}

    let startAng
    points.forEach(point => {
        let ang = Math.atan2(point[0] - centerY, point[1] - centerX)
        if (!startAng) {
            startAng = ang
        } else {
            // ensure that all points are clockwise of the start point
            if (ang < startAng) {
                ang += Math.PI * 2;
            }
        }
        angles[[point[0], point[1]]] = ang
    });

    points.sort(function(a, b) {
        return angles[a] - angles[b];
    });

    points = points.reverse();

    return points
}


function getInterior(points, width, height) {

    let interiorMap = new Array(height).fill(0).map(() => new Array(width).fill(0));

    points.forEach(elem => {
        interiorMap[elem[0]][elem[1]] = 2;
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
                if(interiorMap[i][k] != 2){
                    interiorListTmp.push([i, k]);
                }
                if (flag) {
                    flag = false;
                    interiorList = interiorList.concat(interiorListTmp);
                    break;
                } else {
                    flag = true;
                }
            } else {
                if (flag) {
                    interiorListTmp.push([i, k]);
                }
            }
        }
    }

    return interiorList;
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function angle(a, b, c) {
    lengthA = distance(b, c);
    lengthB = distance(a, c);
    lengthC = distance(a, b);
    return Math.acos((Math.pow(lengthB, 2) + Math.pow(lengthC, 2) - Math.pow(lengthA, 2)) / (2 * lengthB * lengthC));
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

function getCompositeResult(sourceImg, targetImg, offsetY, offsetX, boundary) {
    let sourceCanvas = document.createElement('canvas');
    let targetCanvas = document.createElement('canvas');

    let sourceContext = sourceCanvas.getContext('2d');
    let targetContext = targetCanvas.getContext('2d');

    sourceCanvas.width = sourceImg.width;
    sourceCanvas.height = sourceImg.height;
    
    targetCanvas.width = targetImg.width;
    targetCanvas.height = targetImg.height;

    sourceContext.drawImage(sourceImg, 0, 0);
    targetContext.drawImage(targetImg, 0, 0);

    let sourceImgData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    let source = sourceImgData.data;

    let targetImgData = targetContext.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
    let target = targetImgData.data;

    boundary = polarSort(boundary)

    let interior = getInterior(boundary, sourceCanvas.width, sourceCanvas.height)
    let difference = getDifference(source, target, sourceCanvas.width, targetCanvas.width, offsetY, offsetX, boundary)

    let result = new Uint8ClampedArray(target)

    // r(x) respectively for R, G, B.
    let rR, rG, rB, indexS, indexT;
    for (let i = 0; i < interior.length; i++) {
        let meanValue = getMeanValueCoordinates(boundary, interior[i]);
        rR = 0;
        rG = 0;
        rB = 0;
        for (let j = 0; j < meanValue.length; j++) {
            rR += meanValue[j] * difference[0][j];
            rG += meanValue[j] * difference[1][j];
            rB += meanValue[j] * difference[2][j];
        }
        indexS = calculateIndex(interior[i][0], interior[i][1], sourceCanvas.width);
        indexT = calculateIndex(interior[i][0] + offsetY, interior[i][1] + offsetX, targetCanvas.width);
        result[indexT] = source[indexS] + rR;
        result[indexT + 1] = source[indexS + 1] + rG;
        result[indexT + 2] = source[indexS + 2] + rB;
    }

    return result
}