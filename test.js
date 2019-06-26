let sourceImg = new Image();
let targetImg = new Image();

sourceImg.src = 'source.jpg';
targetImg.src = 'target.jpg'

let sourceCanvas = document.getElementById('sourceCanvas');
let targetCanvas = document.getElementById('targetCanvas');

let sourceContext = sourceCanvas.getContext('2d');
let targetContext = targetCanvas.getContext('2d');

sourceImg.onload = function(){
    sourceCanvas.width = 400
    sourceCanvas.height = 301
    sourceContext.drawImage(sourceImg, 0, 0, sourceImg.width, sourceImg.height);
};

targetImg.onload = function(){
    targetCanvas.width = 1024
    targetCanvas.height= 639
    targetContext.drawImage(targetImg, 0, 0, targetImg.width, targetImg.height);
};

function meow(){

    // let boundary = [[0, 0], [0, 300], [300, 300], [300, 0]]
    let boundary = []
    for(let i = 0 ; i <= 300 ; i += 10){
        boundary.push([0, i])
    }
    for(let i = 300 ; i >= 0 ; i -= 10){
        boundary.push([300, i])
    }
    
    for(let i = 0 ; i <= 300 ; i += 10){
        boundary.push([i, 300])
    }
    
    for(let i = 300 ; i >= 0 ; i -= 10){
        boundary.push([i, 0])
    }

    let compositeResult = getCompositeResult(sourceImg, targetImg, 330, 400, boundary)

    // convert compositeResult to imageData, or it will raise error
    let result = targetContext.createImageData(targetCanvas.width, targetCanvas.height)
    for(let i = 0 ; i < compositeResult.length ; i++){
        result.data[i] = compositeResult[i];
    }

    // update target canvas
    targetContext.putImageData(result, 0, 0);
}

var invertbtn = document.getElementById('btnTest');
invertbtn.addEventListener('click', meow);