const tempOrders = new Map();

export function getTempOrder(merchantOrderId) {
  return tempOrders.get(merchantOrderId);
}

export function setTempOrder(merchantOrderId, orderData) {
  tempOrders.set(merchantOrderId, orderData);
  console.log(`💾 Temp order saved: ${merchantOrderId}, Total temp orders: ${tempOrders.size}`);
}

export function deleteTempOrder(merchantOrderId) {
  tempOrders.delete(merchantOrderId);
  console.log(`🗑️ Temp order deleted: ${merchantOrderId}`);
}

export function getAllTempOrders() {
  return Array.from(tempOrders.entries());
}