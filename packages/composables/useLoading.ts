import { ref } from 'vue'

export function useLoading() {
  const loading = ref<boolean>(false)

  function toggleLoading(bool = true) {
    loading.value = bool
  }

  return {
    loading,
    toggleLoading,
  }
}
