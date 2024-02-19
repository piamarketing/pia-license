(() => {
  function e(e) {
    let n = document.querySelector(".ftr-partners-row-inner-bc");
    if ((n || (n = document.querySelector(".gamble-logos-j")), n)) {
      const t = document.createElement("div");
      t.appendChild(
        (function (e) {
          const n = document.createElement("a");
          (n.href = `https://verification.pagcorlicenses.ph?domain=${e.domain}`),
            (n.target = "_blank");
          const t = document.createElement("img");
          return (
            (t.src = `https://verification.pagcorlicenses.ph/api/validate/logo?domain=${e.domain}`),
            (t.width = e.license?.image?.width || 100),
            n.appendChild(t),
            n
          );
        })(e)
      ),
        n.appendChild(t);
    }
  }
  window.startShowLicense = function (n) {
    e(n);
  };
})();
//# sourceMappingURL=app.js.map
