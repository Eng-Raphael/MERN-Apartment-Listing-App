export const sendResponse = (res, statusCode, message, data = null) => {
    const sanitizedData = sanitizeData(data);
    return res.status(statusCode).json({
        success: statusCode < 400,
        message,
        ...(sanitizedData && { data: sanitizedData }),
    });
};
const sanitizeData = (data) => {
    if (!data)
        return data;
    if (typeof data.toObject === 'function') {
        data = data.toObject();
    }
    if (Array.isArray(data)) {
        return data.map((item) => sanitizeData(item));
    }
    if (typeof data === 'object') {
        const { password, __v, ...rest } = data;
        return rest;
    }
    return data;
};
export default sendResponse;
//# sourceMappingURL=response.js.map