
// after uploading image, show it
$('#file').change(function () {
    console.log('file changed');
    const originalDiv = $('#original');
    const svgWatermarkDiv = $('#svgWatermark');
    const dctWatermarkDiv = $('#dctWatermark');
    if (this.files && this.files[0]) {
        // remove all child elements
        originalDiv.empty();
        originalDiv.append('<h1>原图</h1>');

        svgWatermarkDiv.empty()
        svgWatermarkDiv.append('<h1>SVG 水印</h1>');
        // for svg image and svg watermark
        const svgImgAndMarkDiv = $('<div class="imgAndMark" style="position: relative"></div>');
        svgWatermarkDiv.append(svgImgAndMarkDiv);

        // for dct image
        dctWatermarkDiv.empty();
        dctWatermarkDiv.append('<h1>DCT 水印</h1>');

        const img = document.createElement('img');
        img.src = URL.createObjectURL(this.files[0]);
        img.onload = function () {
            // 加载原图
            originalDiv.append(img);
            console.log('original image loaded');
            // 加载 svg 水印图
            svgImgAndMarkDiv.append(img.cloneNode());

            const markDiv = $('<div class="watermark"></div>');
            svgImgAndMarkDiv.append(markDiv);

            console.log('svg watermark image loaded');
        }
    }
});


function writeIMG() {
    const dctWatermarkDiv = $('#dctWatermark');
    // 清空读取到的信息和 dct 水印图
    $('msgRead').val('');
    dctWatermarkDiv.find('img:last').remove();

    // 将上传的图片加载到 canvas 中，并通过 callback 函数写入水印信息
    loadIMGtoCanvas('file', 'canvas', callbackFunc, 1000);

    function callbackFunc() {
        writeMsg();
        readMsg();
    }

    function writeMsg() {
        const t = writeMsgToCanvas('canvas', $("#msg").val(), '', 1);
        if (t === true) {
            const myCanvas = document.getElementById("canvas");
            const image = myCanvas.toDataURL("image/png");
            const imageElem = $('<img alt="dct image">').attr('src', image);
            dctWatermarkDiv.append(imageElem);
            console.log('DCT watermark written');
        } else {
            console.log('writ DCT watermark failed');
            console.log(t);
        }
    }

    function readMsg() {
        const msg = readMsgFromCanvas('canvas', '', 1);
        console.log('read msg from canvas: ' + msg);
        $('#msgRead').val(msg);
    }
}
