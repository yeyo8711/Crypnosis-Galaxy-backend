const express = require("express");
const cors = require("cors");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { whiteListedAddresses } = require("./addresses.js");
const PORT = process.env.PORT || 3030;
const app = express(),
  DEFAULT_PORT = 3001;
app.use(cors());
app.use(express.json());

const leaves = whiteListedAddresses.map((x) => keccak256(x));
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const buf2hex = (x) => "0x" + x.toString("hex");
// console.log(buf2hex(tree.getRoot()))

app.get("/", (req, res) => {
  const leaf = keccak256("0xD7d83a31940D4e2D7e9d14c6c0afA23978B2eB99");
  const proof = tree.getProof(leaf).map((x) => buf2hex(x.data));
  res.send(proof);
});

app.listen(PORT, function () {
  console.log("Listening On Port ", PORT);
});
