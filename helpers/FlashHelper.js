module.exports = {
  bootstrapAlertClassFor: key => {
    return (
      {
        error: "danger",
        alert: "danger",
        notice: "info"
      }[key] || key
    );
  }
};
