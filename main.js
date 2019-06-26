// (function () {
let boundary = [];

let sourceImg = new Image();
let targetImg = new Image();

function render(top, left) {
    var c = document.createElement('canvas');
    c.setAttribute('id', '_temp_canvas');
    c.width = canvas.width;
    c.height = canvas.height;
    let compositeResult = getCompositeResult(
        sourceImg,
        targetImg,
        top,
        left,
        boundary);
    let result = new ImageData(targetImg.width, targetImg.height);
    for (let i = 0; i < compositeResult.length; i++) {
        result.data[i] = compositeResult[i];
    }
    c.getContext('2d').putImageData(result, 0, 0);
    canvas.backgroundImage._element.src = c.toDataURL();
    canvas.renderAll();
}

const canvas = new fabric.Canvas('canvas', {
    selection: false
});

const fgCanvas = new fabric.Canvas("canvas-fg");

fgCanvas.on("mouse:up", e => {
    // console.log(e.pointer);
    const p = e.pointer;
    boundary.push([Math.round(p.y), Math.round(p.x)]);
    const circle = new fabric.Circle({
        top: p.y - 5,
        left: p.x - 5,
        radius: 5,
        fill: 'white',
        selectable: false,
        hasControls: false,
        hasBorders: false
    });
    fgCanvas.add(circle).renderAll();
})

const fileInput = document.getElementById('file-input'),
    bgInput = document.getElementById('bg-input');

document.getElementById('del').onclick = () => {
    canvas.remove(canvas.getActiveObject());
}

document.getElementById('download').onclick = e => e.target.href = canvas.toDataURL('png');
document.getElementById('render').onclick = () => render(canvas.item(0).top, canvas.item(0).left)
document.getElementById("del-points").onclick = () => {
    fgCanvas.getObjects().forEach(o => fgCanvas.remove(o));
    boundary = [];
}

bgInput.addEventListener("change", (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (f) {
        let data = f.target.result;
        targetImg.src = data;
        fabric.Image.fromURL(data, function (img) {
            canvas.setWidth(img.width)
                .setHeight(img.height)
                .setBackgroundImage(img)
                .renderAll();
        });
    }
    reader.readAsDataURL(file);
    bgInput.value = "";
});

fileInput.addEventListener("change", (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (f) {
        let data = f.target.result;
        sourceImg.src = data;
        fabric.Image.fromURL(data, function (img) {
            fgCanvas.setWidth(img.width)
                .setHeight(img.height)
                .setBackgroundImage(img)
                .renderAll();
            render(canvas.height / 2 - img.height / 2,
                canvas.width / 2 - img.width / 2);
            canvas.add(new fabric.Rect({
                width: img.width,
                height: img.height,
                left: canvas.width / 2 - img.width / 2,
                top: canvas.height / 2 - img.height / 2,
                opacity: 0,
                hasControls: false,
                hasBorders: true
            }).on({
                moving: e => render(e.target.top, e.target.left)
            })).renderAll();
        });
    };
    reader.readAsDataURL(file);
    fileInput.value = "";
});
// })();