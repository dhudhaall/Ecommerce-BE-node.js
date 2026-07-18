export const paypalCapture = async (req, res) => {
  const { orderId } = req.body;

  // call PayPal capture API here...

  await prisma.order.update({
    where: { paypalOrderId: orderId },
    data: { paymentStatus: "paid" }
  });

  res.json({ success: true });
};