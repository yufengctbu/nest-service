-- 初始化角色的权限的类别
INSERT INTO `access_category` (`id`, `name`, `description`, `create_at`, `update_at`)
VALUES
(1, '系统管理', '负责系统管理的权限模块', UNIX_TIMESTAMP(NOW()), UNIX_TIMESTAMP(NOW()));


-- 初始化用户相关的权限
INSERT INTO `access` (`id`,`access_category_id`, `name`, `type`, `action`, `router_url`, `description`, `create_at`, `update_at`)
VALUES
-- (1, 1, '用户信息', 0, 'GET', '/user/list', 'get user list',UNIX_TIMESTAMP(NOW()), UNIX_TIMESTAMP(NOW())),
-- (2, 1, '用户登出', 0, 'GET', '/user/role', 'get user role',UNIX_TIMESTAMP(NOW()), UNIX_TIMESTAMP(NOW()));
