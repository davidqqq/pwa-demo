const PouchService = {};
PouchService.install = function(Vue) {
  const PouchDB = require("pouchdb").default;
  const db = new PouchDB("registration_details");

  function savePendingRegistration(details) {
    return db.put({ _id: "pending", ...details });
  }

  async function getPendingRegistration() {
    const pending = await db.get("pending", { include_docs: true });
    if (pending) {
      return pending;
    } else {
      return null;
    }
  }

  function removePendingRegistration() {
    return db
      .get("pending")
      .then(function(doc) {
        return db.remove(doc);
      })
      .then(function(result) {
        console.log("Pending removed", result);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  Vue.prototype.$service = {
    savePendingRegistration,
    getPendingRegistration,
    removePendingRegistration
  };
};

export default PouchService;
