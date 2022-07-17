import Konva from 'konva'
import { funcWrap } from './index.js';

export const drawGroup = function (stage, layer, data, paths, st) {

    // 1 绘图
    let group = new Konva.Group({
        x: 0,
        y: 0,
        width: 800,
        height: 900
    })

    layer.add(group);
    // group.filters([Konva.Filters.Brighten])

    funcWrap.drawPaths(stage, group, paths);
    const ids = Object.keys(st);
    ids.forEach(el => {
        data.idMap[el].type == 'span' && funcWrap.titleGra(stage, group, [st, data, el]);
        data.idMap[el].type == 'cond' && funcWrap.conditionGra(stage, group, [st, data, el]);
    })

    stage.draw();
}