enum COMMON {
    PARAM_ERROR = 9001, //参数错误
}

// 服务器错误
enum SERVICE {
    SERVICE_ERROR = 9900,
}

// 用户相关的错误
enum USER {
    USER_ALREADY_EXISTS = 900201, // 用户已经存在
}

export const ERROR_CODE = {
    COMMON,
    SERVICE,
    USER,
};
