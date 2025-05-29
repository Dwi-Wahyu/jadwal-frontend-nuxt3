module.exports = {
  apps: [
    {
      name: "E-Jadwal FKG", // Nama aplikasi
      script: ".output/server/index.mjs", // Path ke file yang dijalankan
      env: {
        NITRO_PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
};
