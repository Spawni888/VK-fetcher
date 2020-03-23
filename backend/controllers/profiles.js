const querystring = require('qs');
const axios = require('axios');

const userQueryParams =  {
    access_token: '205356fa205356fa205356fabb202335df22053205356fa7e20db7152664d1e0aacc722',
    user_ids: null,
    fields: [
        'first_name',
        'deactivated',
        'sex',
        'bdate',
        'photo_100',
        'domain',
    ],
    v: 5.52
};

const friendsQueryParams =  {
    access_token: '205356fa205356fa205356fabb202335df22053205356fa7e20db7152664d1e0aacc722',
    user_id: null,
    fields: [
        'first_name',
        'deactivated',
        'sex',
        'bdate',
        'photo_100',
        'domain',
    ],
    v: 5.52
};

async function getProfile(ctx) {
    userQueryParams.user_ids = ctx.params.id;
    const userQueryStr = querystring.stringify(userQueryParams);
    const user = await axios.get(`https://api.vk.com/method/users.get?${userQueryStr}`);
    const userRes = user.data.response;
    let error = user.data.error;

    if (error || userRes[0].deactivated) {
        ctx.throw(422, error && error.error_msg || userRes[0].deactivated);
    }
    friendsQueryParams.user_id = userRes[0].id;

    const friendsQueryStr = querystring.stringify(friendsQueryParams);
    const friends = await axios.get(`https://api.vk.com/method/friends.get?${friendsQueryStr}`);
    const friendRes = friends.data.response;
    error = friends.data.error;

    if (error) {
        return ctx.body = {...userRes[0], friends: { count: 'No info', items: []}}
    }

    ctx.body = {...userRes[0], friends: friendRes};
}

async function getFriends(ctx) {
    friendsQueryParams.user_id = ctx.params.id;
    friendsQueryParams.fields = ['deactivated'];

    const friendsQueryStr = querystring.stringify(friendsQueryParams);
    console.log(friendsQueryStr);
    const friends = await axios.get(`https://api.vk.com/method/friends.get?${friendsQueryStr}`);

    const {response, error} = friends;

    if (error || response.deactivated) {
        ctx.throw(422, error && error.error_msg || response.deactivated);
    }

    ctx.body = response.count;
}

module.exports = {
    getProfile,
    getFriends
};
