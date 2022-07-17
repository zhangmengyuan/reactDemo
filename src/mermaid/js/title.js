import Konva from 'konva'

export const titleGra = function (stage, layer, config) {
    const st = config[0]
    const _idMap = config[1].idMap;
    const nodeId = config[2];

    // 绘图
    let rect = new Konva.Rect({
        x: st[nodeId].a_l.x,
        y: st[nodeId].a_l.y,
        height: st[nodeId].h,
        width: st[nodeId].w,
        stroke: 'rgb(204,204,255)',
        strokeWidth: 1,
        fill: 'rgb(236, 236, 255)',
        cornerRadius: 6
    });
    layer.add(rect);
    // 2 编辑文字
    let kText = new Konva.Text({
        x: st[nodeId].a_l.x + 10,
        y: st[nodeId].a_u.y + 11,
        width: st[nodeId].w - 20,
        height: st[nodeId].h - 20,
        text: _idMap[nodeId].text,
        // text: nodeId,
        fontSize: 16,
        fill: 'black',
        verticalAlign: 'middle',
        // fontStyle: 'italic', 
        align: 'center'
    });
    layer.add(kText);
    stage.draw();
}