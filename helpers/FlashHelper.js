let FlashHelper = {};

FlashHelper.bootstrapAlertClassFor = key => {
  return {
    error: "warning",
    alert: "warning",
    notice: "info",
    success: "success"
  }[key] || key;
};

module.exports = FlashHelper;
