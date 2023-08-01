import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts";
import { resolve } from 'path'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// import DefineOptions from "unplugin-vue-define-options/vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      dts({
        // entryRoot: "./src",
        // outputDir: ["../easyest/es/src", "../easyest/lib/src"],
        //指定使用的tsconfig.json为我们整个项目根目录下,如果不配置,你也可以在components下新建tsconfig.json
        tsConfigFilePath: "./tsconfig.json",
      }),
    dts({
      entryRoot: "dist",
      // outputDir: ["../easyest/es/src", "../easyest/lib/src"],
      //指定使用的tsconfig.json为我们整个项目根目录下,如果不配置,你也可以在components下新建tsconfig.json
      tsConfigFilePath: "./tsconfig.json",
    }),
    Icons({
      compiler: 'vue3',
      customCollections: {
        custom: FileSystemIconLoader('./src/assets/svg'),
      },
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({ importStyle: false }),
        IconsResolver({ prefix: 'icon', customCollections: 'custom' }),
      ],
    }),
      // DefineOptions(),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    //打包后文件目录
    // outDir: "es",
    //压缩
    minify: false,
    rollupOptions: {
      //忽略打包vue文件
      external: ["vue"],
      //input: ["index.ts"],
      output: {
        globals: {
          vue: "Vue",
        },
        dir: "dist",
      },
    },
    lib: {
      entry: resolve(__dirname, 'packages/index.ts'),
      name: "dd-form-render",
      fileName: "dd-form-render",
      formats: ["es", "umd", "cjs"],
    },
  },
})
