// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        //第一名的图片资源
        spriteFrameF:cc.SpriteFrame,

        //第二名的图片资源
        spriteFrameS:cc.SpriteFrame,

        //第三名的图片资源
        spriteFrameT:cc.SpriteFrame,

        //背景图片
        bg: cc.Sprite,
        //名次文本
        rankTxt: cc.Label,
        //名次图片
        rankImg: cc.Sprite,
        //头像框
        icon: cc.Sprite,
        //名字文本
        nameTxt: cc.Label,
        //积分文本
        scoreTxt: cc.Label,


    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setData:function(data,index){
        if (this.rankImg) {
            this.rankImg.node.active = index < 3;
        }

        if(index == 1)
        {   //第一名
            this.rankImg.spriteFrame = this.spriteFrameF
        }else if(index == 2)
        {   //第二名
            this.rankImg.spriteFrame = this.spriteFrameS
        }else if(index == 3){
            //第三名
            this.rankImg.spriteFrame = this.spriteFrameT
        }

        //设置背景的可见
        this.bg.active = index % 2 == 0;

        //设置排名文本
        this.rankTxt.string =  (index + 1);
        this.rankTxt.string = index < 3 ? "" : this.rankTxt.string;

        //获取积分
        var _score = 0;
        if (data.KVDataList) {
            if (data.KVDataList.length > 0) {
                _score = data.KVDataList[0].value;
            }
        }
        //设置积分
        this.scoreTxt.string = _score;
        //创建一个人物头像
        this.createImage(this.icon, data.avatarUrl);
        //设置人物的名字
        this.nameText.string = data.nickname.substring(0, 10);
    },

    //创建一个头像图片
    createImg:function(sprite,url){
        let image = wx.createImage();
        image.onload = function () {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = url;
    },

    // update (dt) {},
});
