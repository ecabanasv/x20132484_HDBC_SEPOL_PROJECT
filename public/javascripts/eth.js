var ethKey = null;
(async function () {
  ethKey = await window.ethereum.request({ method: "eth_requestAccounts" });
  let metaAcc = (await document.getElementById("currentMetaAcc"));
  metaAcc.value = ethKey[0];
})();

(async function () {
window.ethereum.on("accountsChanged", function (accounts) {
  window.location = "/logout";
})();

})

(async function () {
window.ethereum.on("chainChanged", function (chainId) {
  window.location = "/logout";
})();

})
