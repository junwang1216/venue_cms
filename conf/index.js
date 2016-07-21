module.exports = function () {
    var profile = {
        inDocker: process.env.ENV_NAME ? true : false,
        remote_api: 'http://sportschina.bceapp.com/sportschina/',
        hash_base: 20160327,
        debug: true
    };

    profile.upload_7N = {
        ACCESS_KEY: 'm_-m55AwOYkUo2wv41HC35JGunEZnKcwbf6Q-BsT',
        SECRET_KEY: 'ZHjqGYGN5rY8DNxJcHK5mP-uYYUUhgi-mwPatz09',
        DOMAIN: 'http://idawn.cn',
        BUCKET: 'wanvi-sports'
    };

    //profile.inDocker = true;
    return profile;
};
