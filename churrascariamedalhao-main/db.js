// ===== COLE AQUI a configuração do seu projeto Firebase =====
const firebaseConfig = {
  apiKey: "AIzaSyAbokyYTcQs5f2vDhHp3muBKjO24pXPBYM",
  authDomain: "medalhaochurrascaria.firebaseapp.com",
  databaseURL: "https://medalhaochurrascaria-default-rtdb.firebaseio.com/",
  projectId: "medalhaochurrascaria",
  appId: "1:26310395251:web:c2bcedb42a171ad6c23106"
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
