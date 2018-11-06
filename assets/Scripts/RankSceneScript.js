
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        titleLabel: cc.Label,
        itemList: [cc.Node],
        _list: [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        //先设置所有的排名组件为false
        for(let i = 0; i < this.itemList.length; i++){
            if(this.itemList[i]){
                this.itemList[i].active = false;
            }
        }
        
        let _self = this;
        this.display.active = true;
        //每页的个数
        this.num = 6;
        //当前页数
        this.currPage = 0;
        //总页数
        this.maxPage = 0;
        //监听主域发过来的事件
        wx.onMessage(function(data){
            switch(data.type){
                case "score"://积分数据的改变
                    _self._getUserCloudStorage('score', data.value);
                    break;
                case "friend"://好友排行
                    _self.titleLabel.string = "好友排行榜";
                    //设置好友排名数据
                    _self._FriendCloudStorage('score');
                    break;
                case "crowd"://群排行
                    _self.titleLabel.string = "群排行榜";
                    //设置去排行数据
                    _self._GroupCloudStorage('score', data.value);
                    break;
                case "hide"://关闭排行
                    _self.showOrHide(false);
                    break;
                case "show"://显示排行榜
                    _self.showOrHide(true);
                    break;
            }
        });
    },

    //关闭排行面板
    showOrHide:function(boo){
        this.display.active = boo;
    },

    //点击关闭按钮
    onClickCloseBtn:function(){
        this.showOrHide(false)
    },

    //获取所有的好友数据
    _FriendCloudStorage(key){
        let self = this;
        //先清空数组
        delete(self._list);
        //重新new一个数组
        self._list = new Array();
        //微信api获取好友数据
        wx.getFriendCloudStorage({
            keyList: [key],
            //获取数据成功
            success: function(res){
                //绘制排行列表
                self.drawRankList(res.data);
            },
            //获取数据失败
            fail:function(){},
            //获取数据的回调函数 没有成功或者失败的标识
            complete:function(){},
        });
    },

    //获取群排行的数据
    _GroupCloudStorage(key,ticket){
        let self = this;
        delete(self._list)
        self._list = new Array();
        wx.getGroupCloudStorage({
            shareTicket:ticket,
            keyList: [key],
            //获取数据成功
            success: function(res){
                //绘制排行列表
                self.drawRankList(res.KVDataList);
            },
            //获取数据失败
            fail:function(){},
            //回调函数 没有成功或者失败的标识
            complete:function(){},
        });
    },

    _getUserCloudStorage(key,value){
        let self = this;
        wx.getUserCloudStorage({
            keyList: [key],
            success: function(res){
                if(res.KVDataList){
                    if(res.KVDataList.length == 0)
                    {
                        self._setUserCloudStorage(key,value);
                    }else{
                        for(var i = 0 ; i < res.KVDataList.length; i++)
                        {
                            var score = 0;
                            //如果是积分
                            if(res.KVDataList[i].key == key)
                            {
                                score = res.KVDataList[i].value;
                            }

                            //如果积分小于历史数据就不做处理
                            if(score != 0  && score > value)
                            {
                                return;
                            }

                            //更新积分数据
                            self._setUserCloudStorage(key,value);
                        }
                    }
                }
            },
            fail:function(){},
            complete:function(){},
        });
    },

    //自己的积分更新
    _setUserCloudStorage(key,value){
        wx.setUserCloudStorage({
            KVDataList: [{key:key, value:value+""}],
            success:function(res){
            },
            fail:function(){},
            complete:function(){},
        })
    },

    //上一页
    previousPage() {
        if (this.currPage <= 0) {
            return;
        }
        this.currPage--;
        this.updateRankList();
    },

    //上一页
    nextPage() {
        if (this.currPage >= this.maxPage) {
            return;
        }
        this.currPage++;
        this.updateRankList();
    },

    //绘制排行面板
    drawRankList(data){
        //显示排行面板
        this.display.active = true;
        let list = data.sort(this.compare('KVDataList'));
        //初始化当前页数
        this.currPage = 0;
        this._list = list;
        this.maxPage = Math.ceil(list.length/this.num);
        //更新排行列表
        this.updateRankList();
    },

    //更新排行列表
    updateRankList(){
        let num = this.currPage*this.num;
        for(let i = 0; i < this.itemList.length; i++){
            if(this.itemList[i]){
                this.itemList[i].active = false;
                //设置排名组件的可见性
                if(i+num < this._list.length){
                    //设置每个排名组件数据
                    this.itemList[i].active = true;
                    this.itemList[i].getComponent("renderScript").setData(this._list[i+num], i+num);
                }
            }
        }
    },

     //数组排序
     compare(prop) {
        return function (obj1, obj2) {
            var val1 = 0;
            if (obj1[prop].length > 0) {
                val1 = obj1[prop][0].value;
            }
            var val2 = 0;
            if (obj2[prop].length > 0) {
                val2 = obj2[prop][0].value;
            }
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            if (val1 < val2) {
                return 1;
            } else if (val1 > val2) {
                return -1;
            } else {
                return 0;
            }
        }
    },
    

    // update (dt) {},
});
