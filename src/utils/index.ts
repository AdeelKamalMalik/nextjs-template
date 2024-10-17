
export const getAccessToken = () => localStorage.getItem('jwt') || ''
export const clearLocalStorage = () => localStorage.clear();

export const getHeaders = () => {
  const token = getAccessToken()

  return {
    Authorization: `Bearer ${token || ""}`,
    "Content-Type": "application/json",
  }
}