import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createORM } from 'pinia-orm';

import App from './App.vue';
import router from './router';

import './assets/main.css';

const pinia = createPinia().use(createORM());
const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');
