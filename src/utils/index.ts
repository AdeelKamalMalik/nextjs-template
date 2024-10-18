
export const getAccessToken = () => localStorage.getItem('jwt') || ''
export const clearLocalStorage = () => localStorage.clear();

export const getHeaders = () => {
  const token = getAccessToken()

  return {
    Authorization: `Bearer ${token || ""}`,
    "Content-Type": "application/json",
  }
}

export const getFileRequestHeader = () => {
  const token = getAccessToken()

  return {
    'Content-Type': 'multipart/form-data',
    "Authorization": `Bearer ${token || ''}`
  }
}