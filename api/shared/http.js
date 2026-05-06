function json(context, status, body) {
  context.res = {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };
}

module.exports = {
  json,
};
