const admin = require("firebase-admin");

const serviceAccount = require("./erudite-phalanx-182813-firebase-adminsdk-gpsdk-faf9e18cd2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://erudite-phalanx-182813.firebaseio.com"
});

const db = admin.firestore();

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

fastify.register(require("fastify-cors"), {});

fastify.get("/", async (request, reply) => {
  // sanity check
  return {
    message: "success"
  };
});

fastify.get("/user/detail", async (request, reply) => {
  try {
    const decoded = await admin.auth().verifyIdToken(request.headers.token);
    const user = await db
      .collection("users")
      .doc(decoded.uid)
      .get();
    return reply.status(200).send({ email: decoded.email, ...user.data() });
  } catch (err) {
    return reply.status(400).send(err);
  }
});

fastify.post("/users/detail", async (request, reply) => {
  const ids = request.body.userId.map(id => db.doc("users/" + id));
  // console.log(ids);
  try {
    db.getAll(...ids)
      .then(snapshots => {
        const users = [];
        snapshots.forEach(doc => users.push(doc.data()));
        return reply.status(200).send(users);
      })
      .catch(err => console.log(err));
  } catch (err) {
    return reply.status(400).send(err);
  }
});

fastify.post("/register", async (request, reply) => {
  const { email, password, classroom, team } = request.body;
  try {
    const record = await admin.auth().createUser({
      email,
      password,
      disabled: false
    });

    await db
      .collection("users")
      .doc(record.uid)
      .set({ username: email, classroom, team }, { merge: true });
    return reply.send({ classroom, team });
  } catch (err) {
    return reply.send(err);
  }
});

fastify.get("/myclass", async (request, reply) => {
  try {
    const decoded = await admin.auth().verifyIdToken(request.headers.token);
    const user = await db
      .collection("users")
      .doc(decoded.uid)
      .get();

    const snapshot = await db
      .collection("users")
      .where("classroom", "==", user.data().classroom)
      .orderBy("team")
      .get();
    // admin.firestore.FieldPath.documentId();

    if (snapshot.empty) {
      return reply.send({ message: "no result" });
    }
    const members = [];
    snapshot.forEach(doc => members.push({ uid: doc.id, ...doc.data() }));

    return reply.send(members);
  } catch (err) {
    return reply.send(err);
  }
});

fastify.get("/myteam", async (request, reply) => {
  try {
    const decoded = await admin.auth().verifyIdToken(request.headers.token);
    const user = await db
      .collection("users")
      .doc(decoded.uid)
      .get();
    const userData = user.data();
    const snapshot = await db
      .collection("users")
      .where("classroom", "==", userData.classroom)
      .where("team", "==", userData.team)
      .get();
    // admin.firestore.FieldPath.documentId();

    if (snapshot.empty) {
      return reply.send({ message: "no result" });
    }
    const members = [];
    snapshot.forEach(doc => members.push({ id: doc.id, ...doc.data() }));

    return reply.send(members);
  } catch (err) {
    return reply.send(err);
  }
});

fastify.get("/post/first", async (request, reply) => {
  const snap = await db
    .collection("notification")
    .where("user", "==", "myid")
    .orderBy("timestamp")
    .limit(1)
    .get();
  const posts = [];
  const [latestPost] = await snap.forEach(doc => posts.push(doc.data()));
  if (latestPost[0].id === request.query.currentId) {
    return reply.send("nothing");
  } else {
    return reply.send("update");
  }
});

fastify.get("/notification", async (request, reply) => {
  const snap = await db
    .collection("notification")
    .where("user", "==", "myid")
    .orderBy("timestamp")
    .limit(10)
    .get();
  const notifications = [];
  await snap.forEach(doc => notifications.push(doc.data()));

  return reply.send(notifications);
});

fastify.get("/post/list", async (request, reply) => {
  const decoded = await admin.auth().verifyIdToken(request.headers.token);
  const user = await db
    .collection("users")
    .doc(decoded.uid)
    .get();
  const userData = user.data();
  const snapshot = await db
    .collection("post")
    .where("classroom", "==", userData.classroom)
    .get();
  const posts = [];
  snapshot.forEach(doc => ({ postId: doc.id, ...posts.push(doc.data()) }));
  return reply.send(posts);
});

fastify.post("/post/like", async (request, reply) => {
  const decoded = await admin.auth().verifyIdToken(request.headers.token);
  const user = await db
    .collection("users")
    .doc(decoded.uid)
    .get();

  const postId = request.body.postId;
  const ifLiked = await db
    .collection("post")
    .where(admin.firestore.FieldPath.documentId(), "==", postId)
    .where("like", "array-contains", user.id)
    .get();
  if (ifLiked.empty) {
    await db
      .collection("post")
      .doc(postId)
      .update({ like: admin.firestore.FieldValue.arrayUnion(user.id) });
  } else {
    await db
      .collection("post")
      .doc(postId)
      .update({ like: admin.firestore.FieldValue.arrayRemove(user.id) });
  }
  return reply.send("done");
});

// fastify.get("/subscribe", async (request, reply) => {
//   const type = "text/event-stream";

//   const decoded = await admin.auth().verifyIdToken(request.query.token);
//   const user = await db
//     .collection("users")
//     .doc(decoded.uid)
//     .get();
//   const userData = user.data();
//   return reply
//     .header("Content-Type", type)
//     .header("Connection", "keep-alive")
//     .header("Cache-Control", "no-cache")
//     .header("Access-Control-Allow-Origin", "*")
//     .send("yes");
// });

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000, "0.0.0.0");
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
