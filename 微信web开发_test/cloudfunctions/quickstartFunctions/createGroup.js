const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

module.exports = async(event) => {
    let u = event.data;
    //userId   一般来说是自行实现  小程序提供了openid腾讯提供
    //  想要递增小组id怎么办  先查询小组id  给小组id+1
    let res = await db.collection("test-group").count();
    let groupId = parseInt(res.total) + 1;

    let wxContext = cloud.getWXContext();
    let openId = wxContext.openId;
    await db.collection("test-group").add({
        data: {
            leader: u.nickname,
            region: u.region,
            code: u.code,
            age: u.age,
            info: u.info,
            member: 1,
            openId,
            groupId,
        },
    });
    await db.collection("test-form").add({
        data: {
            nickname: u.nickname,
            gender: u.gender === "nv",
            region: u.region,
            code: u.code,
            age: u.age,
            info: u.info,
            isLeader: true,
            openId,
            groupId,
        }
    });
    return {
        success: true,
        groupId,
    }

}