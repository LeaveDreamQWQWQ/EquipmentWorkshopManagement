// components/history_item/history_item.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        history: {
            type: Array,
            value: []
        }

    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        EndUse(e) {
            this.triggerEvent("EndUse", [e.currentTarget.dataset.name])
        },
        Endwait(e){
          this.triggerEvent("EndWait", [e.currentTarget.dataset.name])
        }
    }
})