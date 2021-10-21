function absoluteURL() {
  var a;
  return (url) => {
    if (!a) a = document.createElement("a");
    a.href = url;
    return a.href;
  };
}

module.exports = absoluteURL;
