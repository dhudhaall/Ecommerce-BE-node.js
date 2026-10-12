import EventEmitter from "events";

export const orderEmitter = new EventEmitter();

// Event names
export const ORDER_EVENTS = {
  NEW_ORDER: "NEW_ORDER",
  STATUS_UPDATED: "STATUS_UPDATED",
};

export const broadcastNewOrder = (order) => {
  try {
    orderEmitter.emit(ORDER_EVENTS.NEW_ORDER, order);
  } catch (err) {
    console.error("Error emitting new order event:", err);
  }
};

export const broadcastOrderStatus = (order) => {
  try {
    orderEmitter.emit(ORDER_EVENTS.STATUS_UPDATED, order);
  } catch (err) {
    console.error("Error emitting order status update event:", err);
  }
};
