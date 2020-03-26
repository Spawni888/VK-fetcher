const querystring = require('qs');
const axios = require('axios');

const userQueryParams = {
    access_token: process.env.VK_ACCESS_TOKEN,
    user_ids: null,
    fields: [
        'first_name',
        'deactivated',
        'sex',
        'bdate',
        'photo_100',
        'domain',
    ],
    v: 5.52,
};

const friendsQueryParams = {
    access_token: process.env.VK_ACCESS_TOKEN,
    user_id: null,
    fields: [
        'first_name',
        'deactivated',
        'sex',
        'bdate',
        'photo_100',
        'domain',
    ],
    v: 5.52,
};

const wallQueryParams = {
    access_token: process.env.VK_ACCESS_TOKEN,
    owner_id: null,
    offset: 0,
    count: 5,
    fields: [
        'id',
    ],
    v: 5.52,
};

const fullProfileQueryParams = {
    access_token: process.env.VK_ACCESS_TOKEN,
    user_ids: null,
    fields: [
        'first_name',
        'deactivated',
        'sex',
        'bdate',
        'photo_200_orig',
        'photo_200',
        'photo_400_orig',
        'domain',
    ],
    v: 5.52,
};

const groupQueryParams = {
    access_token: process.env.VK_ACCESS_TOKEN,
    group_id: null,
    offset: 0,
    fields: [

    ],
    v: 5.52,
};

async function getProfile(ctx) {
    userQueryParams.user_ids = ctx.params.id;
    const userQueryStr = querystring.stringify(userQueryParams);
    const user = await axios.get(`https://api.vk.com/method/users.get?${userQueryStr}`);
    const userRes = user.data.response;
    let { error } = user.data;

    if (error || userRes[0].deactivated) {
        ctx.throw(422, error && error.error_msg || userRes[0].deactivated);
    }
    friendsQueryParams.user_id = userRes[0].id;

    const friendsQueryStr = querystring.stringify(friendsQueryParams);
    const friends = await axios.get(`https://api.vk.com/method/friends.get?${friendsQueryStr}`);
    const friendRes = friends.data.response;
    error = friends.data.error;

    if (error) {
        return ctx.body = { ...userRes[0], friends: { count: 'No info', items: [] } };
    }

    ctx.body = { ...userRes[0], friends: friendRes };
}

async function getFriends(ctx) {
    const friendsCountQueryParams = { ...friendsQueryParams };
    friendsCountQueryParams.user_id = ctx.params.id;
    friendsCountQueryParams.fields = ['deactivated'];

    const friendsQueryStr = querystring.stringify(friendsCountQueryParams);
    const friends = await axios.get(`https://api.vk.com/method/friends.get?${friendsQueryStr}`);
    const { response, error } = friends.data;

    if (error) {
        return ctx.body = { count: 0 };
    }
    ctx.body = response;
}

async function getProfileWall(ctx) {
    wallQueryParams.owner_id = ctx.params.id;
    wallQueryParams.offset = ctx.params.offset;

    const wallQueryStr = querystring.stringify(wallQueryParams);
    const wall = await axios.get(`https://api.vk.com/method/wall.get?${wallQueryStr}`);
    const { response, error } = wall.data;

    if (error) {
        ctx.throw(422, error && error.error_msg);
    }
    ctx.body = response;
}

async function getFullProfileInfo(ctx) {
    fullProfileQueryParams.user_ids = ctx.params.id;

    const userQueryStr = querystring.stringify(fullProfileQueryParams);
    const user = await axios.get(`https://api.vk.com/method/users.get?${userQueryStr}`);
    const { response, error } = user.data;

    if (error || response[0].deactivated) {
        ctx.throw(422, error && error.error_msg || response[0].deactivated);
    }

    ctx.body = response[0];
}

async function getGroup(ctx) {
    groupQueryParams.group_id = ctx.params.id;

    const groupQueryStr = querystring.stringify(groupQueryParams);
    const group = await axios.get(`https://api.vk.com/method/groups.getById?${groupQueryStr}`);
    const { response, error } = group.data;

    if (error) {
        ctx.throw(422, error && error.error_msg);
    }
    ctx.body = response[0];
}

module.exports = {
    getProfile,
    getFriends,
    getProfileWall,
    getFullProfileInfo,
    getGroup,
};
