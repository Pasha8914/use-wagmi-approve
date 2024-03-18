import { createApp } from "vue";

import App from "./Root.vue";

import "./style.css";

import { VueQueryPlugin } from "@tanstack/vue-query";
import { UseWagmiPlugin } from "use-wagmi";
import { vueQueryOptions } from "./query";
import { config } from "./wagmi";

createApp(App)
    .use(UseWagmiPlugin, { config })
    .use(VueQueryPlugin, vueQueryOptions)
    .mount("#app");
