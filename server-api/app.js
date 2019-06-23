const restify = require('restify');
const plugins = restify.plugins;
const corsMiddleware = require('restify-cors-middleware');
const rjwt = require('restify-jwt-community');
const secret = require('./secret');

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Authorization'],
    exposeHeaders: ['Authorization']
});

const server = restify.createServer();
server.use(plugins.queryParser());
server.use(plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);

server.use(rjwt(secret.jwt).unless({ path: ['/api/user/signup/', '/api/user/login/', /\/api\/images*/, '/api/test/'] }));
server.listen(8888, '0.0.0.0', () => console.log('Listening on 8888...'));

require('./routes/event/search')(server);
require('./routes/event/near')(server);
require('./routes/event/info')(server);
require('./routes/event/create')(server);
require('./routes/event/pending_req')(server);
require('./routes/event/comment')(server);
require('./routes/event/send_comment')(server);
require('./routes/event/remove_comment')(server);
require('./routes/event/attend_list')(server);
require('./routes/event/attend')(server);
require('./routes/event/attend_in')(server);

require('./routes/city/all')(server);
require('./routes/city/search')(server);

require('./routes/group/create')(server);
require('./routes/group/search')(server);
require('./routes/group/member_in')(server);
require('./routes/group/admin_in')(server);
require('./routes/group/category')(server);
require('./routes/group/member_list')(server);
require('./routes/group/info')(server);
require('./routes/group/group_city_search')(server);
require('./routes/group/update')(server);
require('./routes/group/member_status')(server);
require('./routes/group/member_set')(server);
require('./routes/group/request_list')(server);
require('./routes/group/join_request')(server);
require('./routes/group/as_a_member')(server);
require('./routes/group/all_events')(server);

require('./routes/user/login')(server);
require('./routes/user/signup')(server);
require('./routes/user/myprofile')(server);
require('./routes/user/profile')(server);
require('./routes/user/info')(server);
require('./routes/user/friends')(server);
require('./routes/user/friends_req')(server);
require('./routes/user/friends_res')(server);
require('./routes/user/friends_add')(server);
require('./routes/user/friends_remove')(server);
require('./routes/user/is_friend')(server);
require('./routes/user/profile_picture')(server);

require('./routes/messaging/pm_all')(server);
require('./routes/messaging/pm_between')(server);
require('./routes/messaging/pm_list')(server);
require('./routes/messaging/pm_send')(server);
require('./routes/messaging/gm_between')(server);
require('./routes/messaging/gm_list')(server);
require('./routes/messaging/gm_send')(server);
require('./routes/messaging/gm_all')(server);

require('./routes/upload/upload')(server);
require('./routes/upload/images')(server);

require('./routes/test')(server);
