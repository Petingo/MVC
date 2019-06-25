let sourceImg = new Image();
let targetImg = new Image();

sourceImg.src = 'source.jpg';
targetImg.src = 'target.jpg'

let sourceCanvas = document.getElementById('sourceCanvas');
let targetCanvas = document.getElementById('targetCanvas');

let sourceCtx = sourceCanvas.getContext('2d');
let targetCtx = targetCanvas.getContext('2d');

sourceImg.onload = function(){
    sourceCanvas.width = 400
    sourceCanvas.height = 301
    sourceCtx.drawImage(sourceImg, 0, 0, sourceImg.width, sourceImg.height);
};

targetImg.onload = function(){
    targetCanvas.width = 1024
    targetCanvas.height= 639
    targetCtx.drawImage(targetImg, 0, 0, targetImg.width, targetImg.height);
};

function meow(){
    console.log(sourceImg.width)
    console.log(sourceImg.height)

    let sourceImgData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    let source = sourceImgData.data;

    let targetImgData = targetCtx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
    let target = targetImgData.data;
    
    let boundary = [[100,100], [100,200], [200, 200], [200, 100]]
    let compositeResult = composite(source, target, sourceImg.width, sourceImg.height, targetImg.width, targetImg.height, 200, 100, boundary)
    
    // console.log(compositeResult)
    let result = targetCtx.createImageData(targetCanvas.width, targetCanvas.height)
    for(let i = 0 ; i < compositeResult.length ; i++){
        result.data[i] = compositeResult[i];
    }
    targetCtx.putImageData(result, 0, 0);
    // draw(0, 0);
}

// console.log(canvas);

var invertbtn = document.getElementById('btnTest');
invertbtn.addEventListener('click', meow);