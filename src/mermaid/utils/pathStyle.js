const lineDis = 80 // 左右两侧排线相隔距离
const distanceToFall = 40 // 线段找到到达的x周距离需要垂直下降的距离
const rHeight = 17 // 文字默认行高

let cLeftE = 0; // 当前画线左侧边界
let cRightE = 0; // 当前画线右侧边界
let _st = null; // 样式表
let _lines = null; // 关系数据
let _idMaps = null; // 节点信息
let _ids = null; // 节点信息
let alreadyTraverse = [];

function traverseNodes( current, paths) {
    if (alreadyTraverse.length >= _ids.length) return

    let n_queue = [];
    current.forEach(el => {
        let child = [..._idMaps[el].nextNode].filter(item => alreadyTraverse.indexOf(item) < 0);
        child.forEach(i => {
            // 获取line相关信息
            let res = getLineStyle(el, i);
            paths.push(res);
            // 进行后续操作
            alreadyTraverse.push(i);
            n_queue.push(i)
        })
    })
    traverseNodes(n_queue, paths)
}

function getLineStyle(start, end) {
    let obj = { sn: '', en: '', value: [], text: '', textWidth: 0 };
    [obj.sn, obj.en] = [start, end];
    obj.text = _lines[start][end]
    obj.textWidth = _lines[start][end].length * rHeight;

    let firstP = [_st[start].a_b.x, _st[start].a_b.y];
    let midP = [_st[end].a_u.x, _st[start].a_b.y + distanceToFall];
    let lastP = [_st[end].a_u.x, _st[end].a_u.y];
    obj.value = [...firstP, ...midP, ...lastP]

    return obj

}

function traverseAnotherNodes(paths) {
    let pNode = Object.keys(_lines);
    let extraLines = []
    pNode.forEach(item => {
        let cNode = Object.keys(_lines[item]);
        cNode.forEach(el => {
            let flag = paths.some(p => {
                return (p.sn == item && p.en == el)
            })
            if(!flag) extraLines.push([item, el])
        })
    })
    extraLines.forEach(el => {
        let res = getExtraLineStyle(el[0], el[1]);
        paths.push(res);
    })

}

function getExtraLineStyle( start, end ) {
    let obj = { sn: '', en: '', value: [], color: 'black', text: '', textWidth: 0 };
    [obj.sn, obj.en] = [start, end];
    obj.text = _lines[start][end];
    obj.textWidth = _lines[start][end].length * rHeight;

    let firstP = [];
    let lastP = [];

    function getmidPx(firstP) {
        return firstP[0] - cLeftE > cRightE - firstP[0]
        ? ((cRightE += lineDis), cRightE)
        : ((cLeftE += lineDis), cLeftE);
    }

    if (_st[start].level > _st[end].level) {
        // 当开始节点在结束节点的下面

        if (_st[start].level - _st[end].level === 1) {
            // 开始节点和结束节点只相隔一层

            firstP = [_st[start].a_u.x, _st[start].a_u.y];
            lastP = [_st[end].a_b.x, _st[end].a_b.y];
            obj.value = [...firstP, ...lastP]
        } else {
            // 其他情况

            firstP = [_st[start].a_u.x, _st[start].a_u.y];

            let midPx = getmidPx(firstP)
            let midP1 = [midPx, _st[start].a_u.y - distanceToFall]
            let midP2 = [midPx, _st[end].a_b.y + distanceToFall]
            lastP = [_st[end].a_b.x, _st[end].a_b.y];
            obj.value = [...firstP, ...midP1, ...midP2, ...lastP]
        }
    } else {
        // 当开始节点在结束节点的上面

        if (_st[end].level - _st[start].level === 1) {
            // 开始节点和结束节点只相隔一层

            firstP = [_st[start].a_b.x, _st[start].a_b.y];
            lastP = [_st[end].a_u.x, _st[end].a_u.y];
            obj.value = [...firstP, ...lastP]
        } else {
            // 其他情况

            firstP = [_st[start].a_u.x, _st[start].a_u.y];

            let midPx = getmidPx(firstP)
            let midP1 = [midPx, _st[start].a_b.y + distanceToFall]
            let midP2 = [midPx, _st[end].a_u.y - distanceToFall]
            lastP = [_st[end].a_u.x, _st[end].a_u.y];
            obj.value = [...firstP, ...midP1, ...midP2, ...lastP]
        }
    }

    return obj;

}

export const getPath = function (data, nst, leftEage, rightEage) {
    let _paths = [];
    _lines = data.lines;
    _idMaps = data.idMap;
    _ids = Object.keys(data.idMap);
    _st = nst;
    alreadyTraverse = [];
    cLeftE = leftEage - lineDis;
    cRightE = rightEage + lineDis;
    // 首先将直接和下级子节点相关的线相连
    let start = Object.keys(_idMaps)[0]; // 开始遍历节点
    traverseNodes([start], _paths);
    traverseAnotherNodes(_paths);

    return _paths
}