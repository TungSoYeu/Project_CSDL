const sql = require("mssql");

const config = {
  user: "sa", // thay bằng user SQL Server của bạn
  password: "12345678", // thay bằng password của bạn
  server: "localhost", // hoặc "localhost" nếu dùng instance mặc định
  instanceName: "SQLEXPRESS", // nếu bạn dùng instance khác, bỏ qua nếu dùng instance mặc định
  database: "StudentManagement",
  port: 1433, // cổng mặc định của SQL Server
  options: {
    encrypt: false, // true nếu dùng Azure
    trustServerCertificate: true // dùng cho môi trường dev/local
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Đã kết nối SQL Server");
    return pool;
  })
  .catch(err => console.error("❌ Lỗi kết nối:", err));

module.exports = {
  sql, poolPromise
};
