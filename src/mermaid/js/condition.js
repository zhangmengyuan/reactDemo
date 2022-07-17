import Konva from 'konva'

export const conditionGra = function (stage, layer, config){
    const st = config[0];
    const _idMap = config[1].idMap;
    const nodeId = config[2];
    const edge = st[nodeId].h > st[nodeId].w ? st[nodeId].h : st[nodeId].w;

    // 1 绘图
    let rect = new Konva.Rect({
        x: st[nodeId].a_l.x,
        y: st[nodeId].a_l.y,
        height: edge,
        width: edge,
        rotation: -45,
        stroke: "rgb(204, 204, 255)",
        strokeWidth: 1,
        fill: "rgb(236,236,255)"
    });
    layer.add(rect)

    // 2 编辑文字

    let textWidth = Math.ceil(edge * 1.4);
    let kText = new Konva.Text({
        x: st[nodeId].a_l.x + 20,
        y: st[nodeId].a_l.y - Math.ceil(edge/2),
        width: textWidth,
        height: edge,
        text: _idMap[nodeId].text,
        // text: nodeId,
        fontSize: 16,
        // lineHeight: 7,
        fill: 'black',
        verticalAlign: 'middle',
        // fontStyle: 'italic'
    })
    layer.add(kText);
    stage.draw();
}