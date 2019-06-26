# Mean-Value Membrane
- An implementation of http://www.cs.huji.ac.il/~danix/mvclone/
- Demo：https://petingo.me/MVC/
- Source：https://github.com/Petingo/MVC/

![demo](https://github.com/petingo/MVC/raw/master/demo.png)

### 檔案說明
專案利用 HTML + javascript 完成；主要檔案有 `index.html`、`main.js`、`mvc.js`；其中 `index.html` 和 `main.js` 為網頁前端介面的部分，`mvc.js` 為主要的影像處理邏輯。

### 處理流程
分別上傳背景圖片和合成圖片以後，先在合成圖片上面標點，標點以後會先將點利用 polar sort 的方式進行排序，確保這些邊點是按照順時針方向排列，方便後續操作和計算。

處理完成以後便會開始 render，主要利用 canvas 協助進行 pixel 的改動。依照演算法的流程，首先會針對每個內部像素點計算這些點對於邊緣的 mean-value coordinate（有點類似依照距離和角度計算加權平均的概念），接著對於每個邊緣點、計算它們在來源圖和目標圖中的影像值差距，稱為 difference 值；需要注意的是 RGB 三通到要分別計算。

最後對於每個內部點計算 $r(x) = \sum_{i=0}^{m-1}\lambda_{i}\times \text{diff}_{i}$，將目標圖的影像強度 $g(x)$ 加上 $r(x) = f(x)$ 就是最終結果。