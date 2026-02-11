module.exports = {
  apps: [
    {
      name: "lorem314.io-v27",
      script: "pnpm start --port 3027",

      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
}
