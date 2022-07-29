Page({
    data: {
        groupList: [],
    },
    onLoad: function(event) {
        wx.cloud
            .callFunction({
                name: "quickstartFunctions",
                data: {
                    type: "getManyGroup",
                },
            })
            .then((res) => {
                this.setData({
                    groupList: res.result.groupList,
                });
            });
    },

});