<template>
    <div id="paintBoard">
        <div class="paintTitle" style="font-weight:bold">
            流程图（梦）
            
        </div>
        <div id="Board">
            <div id="container"></div>
        </div>
    </div>
</template>

<script>

    import Konva from 'konva'

    import { codeParse } from './utils/codeParse.js'
    import { dataTransform } from './utils/transformData.js'
    import { getPath } from './utils/pathStyle.js'
    import { setTimeout } from 'timers'

    // import { funcWrap } from './js/index.js'
    import { drawGroup } from './js/drawGroup.js'
    export default {
        mounted(){
            let code = 
            "id1(ERP)-->|发送新增生产计划|id2{sws进行校验};" +
            "id2(ERP)-->|返回自动校验结果|id1;"
            this.data = codeParse(code);
            let res = dataTransform(this.data)
            this.st = res[0]
            this.paths = getPath(this.data, this.st, res[1], res[2]);
            setTimeout(() => {
                let container = document.getElementById('container')
                if (container) {
                    let width = container.offsetWidth;
                    let height = container.offsetHeight;
                    this.stage = new Konva.Stage({
                        container: 'container',
                        width: width,
                        height: height, 
                        draggable: true
                    })

                    this.layer = new Konva.Layer();
                    this.stage.add(this.layer)
                    this.stage.draw();
                }
                this.startDraw()
            })
        },
        data(){
            return {
                activeName: 'productInfo',
                data: {},
                st: {},
                paths: [],
                stage: null, 
                layer: null,
                stageBg: '#FFF'
            }
        },
        computed: {},
        methods: {
            startDraw() {
                drawGroup(this.stage, this.layer, this.data, this.paths, this.st)
            }
        }
    }
</script>
<style>
#paintBoard {
    height: 100%;
    width: 100%;
}
.paintTitle {
    height: 36px;
    width: 100%;
    line-height: 34px;
    padding-left: 20px;
    background: yellow;
}
#Board {
    height: calc(100% - 36px);
    background: rgb(206, 216, 231);
    padding: 20px 4px;

}
#Board #container{
    height: 1000px;
    width: calc(100% - 200px);
    background: #FFF;
    box-shadow: 5px 5px 5px rgba(71, 71, 71, 0.356)
}
</style>