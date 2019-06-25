主要就 `test.js` 的這段：

```javascript
let compositeResult = getCompositeResult(sourceImg, targetImg, 330, 400, boundary)

// convert compositeResult to imageData, or it will raise error
let result = targetContext.createImageData(targetCanvas.width, targetCanvas.height)
for(let i = 0 ; i < compositeResult.length ; i++){
    result.data[i] = compositeResult[i];
}

// update target canvas
targetContext.putImageData(result, 0, 0);

```
`getCompositeResult(sourceImg, targetImg, offsetY, offsetX, boundary)` 裡面 sourceImg 跟 targetImg 都是 js 的 Image(), 然後 boundary 是外面的圈圈，好像要順時針不然會爆掉；然後弄回來的結果要先轉回 imageData 才能塞回 canvas，大 guy 4 這樣：）