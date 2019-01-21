import * as requestProduct from '../simulateServer/products/requestProducts'
import * as requestFormats from '../simulateServer/formats/requestFormats'

export const getProducts = ({ commit, getters }) => {
  requestProduct.getProducts({
    userId: getters.userId,
    token: getters.token
  })
    .then(response => { commit('storeProducts', response.products) })
    .catch(error => { console.log(error) })
}

export const getMyProducts = ({ commit, getters }) => {
  requestProduct.getMyProducts({
    userId: getters.userId,
    token: getters.token
  })
    .then(response => { commit('storeMyProducts', response.myProducts) })
    .catch(error => { console.log(error) })
}

export const createProduct = ({ commit, getters }, { newProduct }) => {
  requestProduct.createProduct({
    userId: getters.userId,
    token: getters.token,
    newProduct
  })
    .then(response => { commit('storeMyProducts', response.myProducts) })
    .catch(error => { console.log(error) })
}

export const updateProduct = ({ commit, getters }, { productId, newProps }) => {
  requestProduct.updateProduct({
    userId: getters.userId,
    token: getters.token,
    productId,
    newProps
  })
    .then(response => { commit('storeMyProducts', response.myProducts) })
    .catch(error => console.log(error))
}

export const setEditedProduct = ({ commit, getters }, { productId }) => {
  const localProduct = getters.productsInInventory[productId]
  if (localProduct) commit('setEditedProduct', localProduct)
  else {
    requestProduct.getMyProducts({
      userId: getters.userId,
      token: getters.token
    })
      .then(response => commit('setEditedProduct', response.myProducts[productId]))
      .catch(error => console.log(error))
  }
}

export const getFormats = ({ commit, getters }) => {
  requestFormats.getFormats({
    userId: getters.userId,
    token: getters.token
  })
    .then(response => commit('storeFormats', { formats: response.formats }))
    .catch(error => console.log(error))
}

export const getFormatsOfProduct = ({ commit, getters }, { productId }) => {
  requestFormats.getFormatsOfProduct({
    userId: getters.userId,
    token: getters.token,
    productId
  })
    .then(response => commit('storeFormats', { formats: response.formats }))
    .catch(error => console.log(error))
}

export const updateFormatsOfProduct = ({ commit, getters }, { productId, formats }) => {
  return new Promise((resolve, reject) => {
    requestFormats.updateFormatsOfProduct({
      userId: getters.userId,
      token: getters.token,
      productId,
      formats
    })
      .then(response => {
        commit('storeFormats', { formats: response.formats })
        resolve()
      })
      .catch(error => console.log(error))
  })
}

export const setEditedFormats = ({ commit, getters }, { productId }) => {
  const localFormats = getters.formatsOfProduct(productId)
  if (localFormats) commit('setEditedFormats', { formats: localFormats })
  else {
    requestFormats.getFormatsOfProduct({
      userId: getters.userId,
      token: getters.token,
      productId
    })
      .then(response => commit('setEditedFormats', { formats: response.formats }))
      .catch(error => console.log(error))
  }
}
