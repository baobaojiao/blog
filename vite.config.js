import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// 按需引入ElementPlus组件
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    }),

    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ["vue", "vue-router"],

      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),

        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon",
        }),
      ],
    }),

    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),

        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"],
        }),
      ],
    }),

    Icons({
      autoInstall: true,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        // 静态资源打包做处理
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
