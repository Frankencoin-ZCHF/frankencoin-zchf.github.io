import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import useUsersRepository from '@/repositories/useUsersRepository';

let signer;

export default defineStore('auth', {
  state: () => ({
    wallet: useStorage(
      import.meta.env.VITE_APP_LOCALSTORAGE_USER + '_wallet',
      null
    ),
    chainId: useStorage(
      import.meta.env.VITE_APP_LOCALSTORAGE_USER + '_chainId',
      null
    ),
    connector: useStorage(
      import.meta.env.VITE_APP_LOCALSTORAGE_USER + '_connector',
      null
    ),
  }),

  getters: {
    isConnected: (state) => !!state.wallet,
    user: (state) => {
      const usersRepository = useUsersRepository();
      return usersRepository.getByPosition(state.wallet);
    },
  },

  actions: {
    connect(userData, _signer) {
      this.wallet = userData.wallet;
      this.chainId = userData.chainId;
      this.connector = userData.connector;
      signer = _signer;
    },
    disconnect() {
      this.wallet = null;
      this.chainId = null;
      this.connector = null;
    },
    getSigner() {
      return signer;
    },
  },
});
