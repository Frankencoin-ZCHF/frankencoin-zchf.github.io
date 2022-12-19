import { createRouter, createWebHistory } from 'vue-router';

import SwapView from '@/views/SwapView.vue';
import HomeView from '@/views/HomeView.vue';
import PositionsView from '@/views/PositionsView.vue';
import AuctionsView from '@/views/AuctionsView.vue';
import PoolView from '@/views/PoolView.vue';
import PositionDetailView from '@/views/PositionDetailView.vue';
import PositionOpenView from '@/views/PositionOpenView.vue';
import PositionAdjustView from '@/views/PositionAdjustView.vue';
import PositionChallengeView from '@/views/PositionChallengeView.vue';
import PositionPlaceBid from '@/views/PositionPlaceBid.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        documentation: 'https://docs.frankencoin.com/',
      },
    },
    {
      path: '/swap',
      name: 'swap',
      component: SwapView,
      meta: {
        documentation: 'https://docs.frankencoin.com/',
      },
    },
    {
      path: '/positions',
      name: 'positions',
      component: PositionsView,
      meta: {
        documentation: 'https://docs.frankencoin.com/',
      },
    },
    {
      path: '/auctions',
      name: 'auctions',
      component: AuctionsView,
      meta: {
        documentation: 'https://docs.frankencoin.com/',
      },
    },
    {
      path: '/pool',
      name: 'pool',
      component: PoolView,
      meta: {
        documentation: 'https://docs.frankencoin.com/',
      },
    },
    {
      path: '/position/open/:address',
      name: 'positionOpen',
      component: PositionOpenView,
      meta: {
        documentation: 'https://docs.frankencoin.com/',
      },
    },
    {
      path: '/position/adjust/:address',
      name: 'positionAdjust',
      component: PositionAdjustView,
      meta: {
        documentation: 'https://docs.frankencoin.com/',
      },
    },
    {
      path: '/position/detail/:address',
      name: 'positionDetail',
      component: PositionDetailView,
      meta: {
        documentation: 'https://docs.frankencoin.com/',
      },
    },
    {
      path: '/position/challenge/:address',
      name: 'positionChallenge',
      component: PositionChallengeView,
      meta: {
        documentation: 'https://docs.frankencoin.com/',
      },
    },
    {
      path: '/position/bid/:address/:challenge',
      name: 'positionPlaceBid',
      component: PositionPlaceBid,
      meta: {
        documentation: 'https://docs.frankencoin.com/',
      },
    },
  ],
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  },
});

export default router;
