Page({
    data: {
        date: "",
        region: [],
        groupId: "",
        loading: false,
        infop: "介绍基础情况，如你的学习进度，希望组员要做到的事，你小组的规则，学习安排，你能提供的帮助等，以便招到和你相符合的成员报名",
    },
    onload: function(e) {
        if (e.groupId) {
            this.setData({
                groupId: e.groupId,
                info: "和小组长打个招呼把~可以简单的介绍一下自己的情况，未来大家一起努力学习！"
            })
        }
    },
    submit: function(e) {
        if (this.data.loading) {
            return;
        }
        let u = e.detail.value;
        if (!u.nickname) {
            wx.showToast({
                title: "请输入昵称",
                icon: "error",
            });
            return;
        }
        if (!u.gender) {
            wx.showToast({
                title: "请选择性别",
                icon: "error",
            });
            return;
        }
        if (!u.date) {
            wx.showToast({
                title: "请选择出生地",
                icon: "error"
            });
            return;
        }
        if (!u.code) {
            wx.showToast({
                title: "请输入可添加到你的微信好或手机号",
                icon: "error",
            });
            return;
        }
        this.setData({
            loading: true,
        });
        wx.showLoading({});

        if (this.data.groupId) {
            wx.cloud.callFunction({
                name: "quickstartFunctions",
                data: {
                    type: "joinGroup",
                    data: {
                        ...u,
                        age: new Date().getFullYear() - this.data.date,
                        region: this.data.region,
                        groupId: Number(this.data.groupId)
                    },
                },
            }).then((res) => {
                this.setData({
                    loading: false,
                });
                wx.hideLoading();


                if (res.result.success) {
                    wx.setStorageSync("groupId", this.data.groupId);
                    wx.redirectTo({
                        url: "/pages/tip/index?groupId=" + this.data.groupId + "&code=" + res.result.code,

                    });

                } else {
                    wx.shoeModal({
                        title: "提示",
                        content: res.result.errorMessage,
                        success: function() {
                            wx.navigateBack({
                                delta: 1,
                            });
                        },
                    });
                }
            });

        } else {
            wx.cloud.callFunction({
                name: "quickstartFunctions",
                data: {
                    type: "createGroup",
                    data: {
                        ...u,
                        age: new Date().getFullYear() - this.data.date,
                        region: this.data.region,
                    },
                },
            }).then((res) => {
                wx.setStorageSync("groupId", res.result.groupId);
                this.setData({
                    loading: false,
                });
                wx.hideLoading();
                wx.redirectTo({
                    url: "/pages/tip/index?groupId=" + String(res.result.groupId),
                });
            });
        }

    },
    dateChange: function(e) {
        this.setData({
            date: e.detail.value,
        });
    },
    regionChange: function(e) {
        this.setData({
            region: e.detail.value,
        });
    },
});