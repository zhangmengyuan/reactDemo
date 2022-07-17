import Konva from 'konva'
const rHeight = 17; // 文字默认行高
function drawPath (layer, path) {
    var arrow = new Konva.Arrow({
        points: path.value,
        pointerLength: 10,
        pointerWidth: 5,
        fill: path.color || 'black',
        stroke: path.color || 'black',
        strokeWidth: 1
    })
    layer.add(arrow)

    let textX = 0;
    let textY = 0;
    if (path.value.length == 4) {
        textX = (path.value[0] + path.value[2]) / 2 - (path.textWidth/2);
        textY = (path.value[1] + path.value[3]) / 2 - rHeight;
    }
    if (path.value.length == 6 || path.value.length == 8) {
        textX = (path.value[2] + path.value[4]) / 2 - (path.textWidth/2);
        textY = (path.value[3] + path.value[5]) / 2 - rHeight;
    }

    let kText = new Konva.Text({
        x: textX,
        y: textY,
        width: path.textWidth,
        height: rHeight,
        text: path.text,
        fontSize: 16,
        fill: 'black',
        verticalAlign: 'middle'
    })
    layer.add(kText)
}

export const drawPaths = function (stage, layer, config) {
    // 2 绘图
    config.forEach(el => {
        drawPath(layer, el)
    })

    stage.draw(stage, layer, config)
}