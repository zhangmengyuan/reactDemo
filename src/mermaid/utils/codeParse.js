const rHeight = 17; // 文字默认行高
const padding = 10; // 内边距为 10
const maxTextWidth = 240; // 文字展示最大宽度

function myMatch (str, regx) {
    let res = str.match(regx);
    return (res ? res : '')
}

function getLineInfo(match) {
    if(match === null) return ''
    if (match.length > 1) {
        console.error('书写错误，定义了两条关系线');
        return false
    }
    return match[0].trim()
}

function getStartNode(match) {
    if(!match) {
        console.error('开始节点未定义');
        return false;
    }

    let m_v = match[0];
    let nodeInfo = ''
    let nodeId = ''
    let nodeType = 'span';
    // FIXME: 只判断了有没有（）{}，四个符号，但是没有对其出现顺序进行判断
    if (m_v.indexOf("(") > -1 && m_v.indexOf(")") > -1){
        nodeInfo = myMatch(m_v, /(?<=\().+(?=\))/g)[0];
        nodeId = myMatch(m_v, /^.+(?=\()/g)[0];
        nodeType = "span"
    } else if (m_v.indexOf("{") > -1 && m_v.indexOf("}") > -1) {
        nodeInfo = myMatch(m_v, /(?<=\{}).+(?=\})/g)[0];
        nodeId = myMatch(m_v, /^.+(?=\{)/g)[0];
        nodeType = "cond"
    } else {
        nodeId = m_v;
    }

    return { nodeId: nodeId.trim(), nodeInfo: nodeInfo.trim(), type: nodeType }
}

function getEndNode(match) {
    if(!match) {
        console.error('开始节点未定义');
        return false;
    }
    let m_v = match.trim();
    let nodeInfo = ''
    let nodeId = ''
    let nodeType = 'span';

    // FIXME: 只判断了有没有（）{}，四个符号，但是没有对其出现顺序进行判断
    if (m_v.indexOf("(") > -1 && m_v.indexOf(")") > -1){
        nodeInfo = myMatch(m_v, /(?<=\().+(?=\))/g)[0];
        nodeId = myMatch(m_v, /^.+(?=\()/g)[0];
        nodeType = "span"
    } else if (m_v.indexOf("{") > -1 && m_v.indexOf("}") > -1) {
        nodeInfo = myMatch(m_v, /(?<=\{).+(?=\})/g)[0];
        nodeId = myMatch(m_v, /^.+(?=\{)/g)[0];
        nodeType = "cond"
    } else {
        nodeId = m_v;
    }

    return { nodeId: nodeId.trim(), nodeInfo: nodeInfo.trim(), type: nodeType }
}

function lineMapBuild(data, lines) {
    let { startNode:sN, endNode: eN, lineLabel: lInfo } = data;
    
    if (!Object.prototype.hasOwnProperty.call(lines, sN.nodeId)) {
        lines[sN.nodeId] = {};
    }

    lines[sN.nodeId][eN.nodeId] = lInfo;
}

function idMapBuild(data, cNode, idMap ) {
    if (!Object.prototype.hasOwnProperty.call(idMap, data.nodeId)) {
        // 计算包裹文字的盒子的高度
        let boxWH = cumpute(data.nodeInfo.length * rHeight, data);
        let obj = {
            box: boxWH,
            text: data.nodeInfo,
            textWidth: data.nodeInfo.length * rHeight,
            type: data.type,
            nextNode: new Set()
        }
        idMap[data.nodeId] = obj;
    } else {
        if (idMap[data.nodeId] === "") {
            idMap[data.nodeId].text = data.nodeInfo;
            idMap[data.nodeId].textWidth = idMap[data.nodeId].text.length * 17;
        }
    }
    if (cNode) {
        idMap[data.nodeId].nextNode.add(cNode)
    }
}
// 计算装填文字的容器的高度
function cumpute(textWidth, node) {
    let p = padding * 2; // 单边的padding值为10
    let h = 0, w = 0;

    if(textWidth <= maxTextWidth) {
        h = rHeight + p;
        w = textWidth + p;
    } else {
        // row行数
        let rows = Math.ceil(textWidth / maxTextWidth);
        h = rHeight * rows + p;
        w = maxTextWidth + p;
    }
    if (node.type === 'cond') {
        h = h > w ? h : w;
        w = h;
    }
    if (w <= 20) {
        h = 60;
        w = 60;
    }
    return { h,w }
}

export const codeParse = function (code) {
    // 根据：对每一条数据进行划分
    let c_p = code.split(';');
    let idMap = {};
    let lines = {};
    if (c_p[c_p.length - 1] === '') c_p.length--;
    c_p.forEach(val => {
        let oTemp = {};

        // 获取线段信息
        oTemp.lineLabel = getLineInfo(val.match(/(?<=\|).+(?=\|)/g));
        // 后去开始节点信息
        oTemp.startNode = getStartNode(val.match(/^.+(?=-->)/));
        // 获取结束节点信息
        oTemp.endNode = getEndNode(val.split(myMatch(val, /-->(\|.+\|)*/g)[0])[1])

        // 建立关系线map
        lineMapBuild(oTemp, lines);

        // 建立节点map
        idMapBuild(oTemp.startNode, oTemp.endNode.nodeId, idMap);
        idMapBuild(oTemp.endNode, null, idMap);

        return oTemp
    })

    return { idMap, lines }
}