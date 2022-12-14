const express = require("express");
const cors = require("cors");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { whiteListedAddresses } = require("./addresses.js");
const PORT = process.env.PORT || 3030;
const app = express(),
  DEFAULT_PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

const leaves = whiteListedAddresses.map((x) => keccak256(x));
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const buf2hex = (x) => "0x" + x.toString("hex");
// console.log(buf2hex(tree.getRoot()))

app.get("/", (req, res) => {
  const leaf = keccak256(req.query.wallet);
  const proof = tree.getProof(leaf).map((x) => buf2hex(x.data));
  res.send(proof);
});

app.listen(PORT, function () {
  console.log("Listening On Port ", PORT);
});
// root 0x5d1c03b612f1b8707484e0c0690bc94ec7e6e9777dddada044ff4870476f412d
