import create from 'zustand'

const useUserStore = create(set => ({
  userInfo: '',
  setUserInfo: (info) => set({ userInfo: info }),
}));

export default useUserStore;