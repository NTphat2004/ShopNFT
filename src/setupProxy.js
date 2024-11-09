const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/ghn", // Đảm bảo /ghn được giữ lại trong URL
    createProxyMiddleware({
      target: "https://dev-online-gateway.ghn.vn", // API GHN
      changeOrigin: true,
      pathRewrite: {
        "^/ghn": "", // Loại bỏ /ghn từ yêu cầu gửi tới API GHN
      },
    })
  );
};
