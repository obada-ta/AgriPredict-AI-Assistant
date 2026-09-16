const tokenBlacklist = new Set();

export const addToBlacklist = (token) => {
    tokenBlacklist.add(token);
    // اختياري: أزل التوكن تلقائيًا بعد انتهائه (7 أيام = 604800000 مللي ثانية)
    setTimeout(() => {
        tokenBlacklist.delete(token);
    }, 1 * 24 * 60 * 60 * 1000);
};

export const isBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};
// 
export const BaseURL = 'http://10.210.178.156:3000'
// export const BaseURL = 'http://192.168.1.102:3000'
// export const BaseURL = 'http://192.168.1.103:3000'
// export const BaseURL = 'http://192.168.105.112:3000'
