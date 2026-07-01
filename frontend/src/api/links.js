import api from './axios'

export const getLinks = async () => {
  const response = await api.get('/links')
  return response.data
}

export const getLinkById = async (id) => {
  const response = await api.get(`/links/${id}`)
  return response.data
}

export const createLink = async (linkData) => {
  const response = await api.post('/links', linkData)
  return response.data
}

export const updateLink = async (id, linkData) => {
  const response = await api.put(`/links/${id}`, linkData)
  return response.data
}

export const deleteLink = async (id) => {
  const response = await api.delete(`/links/${id}`)
  return response.data
}

export const getLinkStats = async (id) => {
  const response = await api.get(`/links/${id}/stats`)
  return response.data
}
