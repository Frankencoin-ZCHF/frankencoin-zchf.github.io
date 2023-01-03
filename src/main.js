import { createPinia } from 'pinia';
import { createORM } from 'pinia-orm';
import { createApp } from 'vue';

import App from './App.vue';
import './assets/main.css';
import router from './router';

const pinia = createPinia().use(createORM());
const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');
