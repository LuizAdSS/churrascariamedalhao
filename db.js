// ===== COLE AQUI a configuração do seu projeto Firebase =====
const firebaseConfig = {
  apiKey: "AIzaSyCTYTvH8KRq56t-ASSVsvG6jafHhhWEzJI",
  authDomain: "medalhao-churrascaria-ca501.firebaseapp.com",
  databaseURL: "https://medalhao-default-rtdb.firebaseio.com",
  projectId: "medalhao-churrascaria-ca501",
  appId: "1:1014892920106:web:abefa5e65f8406c9d87253"
};
// Sem a configuração, o site funciona em "modo teste" (só no mesmo navegador).
const online = firebaseConfig.apiKey !== "COLE_AQUI" && window.firebase;
let ref;
if (online) { firebase.initializeApp(firebaseConfig); ref = firebase.database().ref("pedidos"); }
const lerLocal = () => JSON.parse(localStorage.getItem("pedidos") || "{}");
const DB = {
  modo: online ? "online" : "modo teste (mesmo navegador)",
  enviar(p) {
    p.hora = Date.now(); p.status = "novo";
    if (online) { const r = ref.push(p); return r.then(() => r.key); }
    const id = "p" + p.hora, l = lerLocal(); l[id] = p;
    localStorage.setItem("pedidos", JSON.stringify(l));
    if (DB._cb) DB._cb();
    return Promise.resolve(id);
  },
  ouvir(cb) {
    if (online) return ref.on("value", s => cb(s.val() || {}));
    DB._cb = () => cb(lerLocal()); DB._cb();
    window.addEventListener("storage", DB._cb);
  },
  limpar() {
    if (online) return ref.remove();
    localStorage.removeItem("pedidos"); DB._cb();
    return Promise.resolve();
  },
  pronto(id) {
    if (online) return ref.child(id).update({ status: "pronto" });
    const l = lerLocal(); l[id].status = "pronto";
    localStorage.setItem("pedidos", JSON.stringify(l)); DB._cb();
  }
};
