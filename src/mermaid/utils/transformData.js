

const TtB = 100; // 每个图形上下相隔距离
const LtR = 300;// 每个图形左右相隔距离
const ori = { x: 500, y: 50}; // 第一个节点的位置

let LeftEage = 40; // 图形最右侧边界值
let RightEage = 40; // 图形最右侧边界值
let alreadyHave = [];// 已经遍历过后的数据队列
let c_queue = []; // 当前遍历队列
let n_queue = [];// 下次遍历队列

/**
 * 节点属性：
 * @param {string} node 节点信息
 * @param {string} mid 节点中心点坐标
 * @param {string} styleMap 需要创建的样式表
 * @param {string} nodeId 节点名称（id）
 * @param {string} level 节点所在层级
 * @param {string} h 高
 * @param {string} w 宽
 * @param {string} level 层级
 * @param {string} a_u (x, y) 上部锚点坐标
 * @param {string} a_b (x, y) 下部锚点坐标
 * @param {string} a_l (x, y) 左部锚点坐标
 * @param {string} a_r (x, y) 右部锚点坐标
 */

 function getNodeParams( node, mid, styleMap, nodeId, level) {
     let nParams = {};
     if ( node.type == 'span') nParams = getSpanParams( node, mid );
     if ( node.type == 'cond') nParams = getConditionParams( node, mid );
     nParams.level = level;
     styleMap[nodeId] = nParams;

     alreadyHave.push(nodeId)
     LeftEage = LeftEage > nParams.a_l.x ? nParams.a_l.x : LeftEage;
     RightEage = RightEage > nParams.a_r.x ? nParams.a_r.x : RightEage;

     return nParams.a_r.x + LtR;
 }

 // 获取普通节点的定位元素
 function getSpanParams( node, mid ) {
     
    let { h, w } = node.box;
    let a_u,a_b,a_l,a_r;
    a_u = a_b = a_l = a_r = null;

    let half_h = Math.ceil(h / 2);
    let half_w = Math.ceil(w / 2);

    a_u = { x: mid.x, y: mid.y - half_h};
    a_b = { x: mid.x, y: mid.y + half_h};
    a_l = { x: mid.x - half_w, y: mid.y};
    a_r = { x: mid.x + half_w, y: mid.y};

    return {
        h, w, a_u, a_b, a_l, a_r
    }

 }
 // 获取条件节点定位元素
 function getConditionParams(node, mid) {

    let a_u,a_b,a_l,a_r;
    a_u = a_b = a_l = a_r = null;
    let { h, w } = node.box;
    // 以最长边为边长
    h = h > w ? h : w;
    w = h;
    let v = Math.ceil(h / 1.414) // 根据中心位置应该有的偏移量

    a_u = { x: mid.x, y: mid.y - v};
    a_b = { x: mid.x, y: mid.y + v};
    a_l = { x: mid.x - v, y: mid.y};
    a_r = { x: mid.x + v, y: mid.y};

    return {
        h, w, a_u, a_b, a_l, a_r
    }
 }

 function getNodesStyle( topEage, styleMap, startNodeArr, _idMaps, level ){
     if(alreadyHave.length >= Object.keys(_idMaps).length) {
         return;
     }
     if (startNodeArr.length == 0) {
         console.error('有错误')
         return;
     }
     c_queue = startNodeArr; // 当前遍历队列
     n_queue= []; // 下次遍历队列

     // 当前遍历队列中子节点高度最高的值
     c_queue.forEach(el => {
         n_queue = n_queue.concat(..._idMaps[el].nextNode).filter(el => alreadyHave.indexOf(el) < 0);
     })
     n_queue = n_queue.filter(el => alreadyHave.indexOf(el) < 0)

     let maxHNode = { id: n_queue[0], h: _idMaps[n_queue[0]].box.h };
     n_queue.forEach(el => {
         // 寻找当前遍历队列中子节点高度最高的值
         let h = 0;
         if( _idMaps[el].type == 'cond'){
             h = Math.ceil(_idMaps[el].box.h * 1.414)
         } else {
             h = _idMaps[el].box.h
         }
         if ( maxHNode.h < h ) [maxHNode.id, maxHNode.h] = [el, h];
     })

     // 计算当前遍历队列节点的纵坐标中心值
     const rowMidY = topEage + TtB + Math.ceil(maxHNode.h / 2)

     // 开始
     let count = 1;
     let nextLeftX = LeftEage;
     c_queue.forEach(item => {
         let child = [..._idMaps[item].nextNode].filter(el => alreadyHave.indexOf(el) < 0);
         if (count == 1 && child.length == 1) {
             nextLeftX = getNodeParams(_idMaps[child[0]], { x: styleMap[item].a_u.x, y: rowMidY }, styleMap, child[0], level );
         } else {
             child.forEach(el => {
                 nextLeftX = getNodeParams(_idMaps[el], { x: nextLeftX + 40, y: rowMidY }, styleMap, el, level)
             })
         }
         count++;
     })
     getNodesStyle(rowMidY + Math.ceil(maxHNode.h/2), styleMap, n_queue, _idMaps, level+1)
 }

 export const dataTransform = function (data) {
     const _idMaps = data.idMap;
     const _styleMap = {};
     let startNode = Object.keys(_idMaps)[0];
     getNodeParams(_idMaps[startNode], ori, _styleMap, startNode, 1);
     RightEage = _styleMap[startNode].a_r.x;
     alreadyHave = [startNode];
     getNodesStyle(_styleMap[startNode].a_b.y, _styleMap, [startNode], _idMaps, 2);
     return [_styleMap, LeftEage, RightEage]
 }