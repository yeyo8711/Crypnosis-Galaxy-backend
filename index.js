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
  console.log(req.query);
});

app.listen(PORT, function () {
  console.log("Listening On Port ", PORT);
});

// ["0x97da54f46aa9b1b509227c3fec85f7594fc6acc5174120c6a6b9dc4bf51cf289","0x1163ec27e048e5495765b3d73da5d8f40c582722733dafad9a1cc24d0f16758b","0x68763e521f326223e1b25d71e1143b8e58b47d7e86aeb2b95dfc916dcfd7702c"]
// ["0x97da54f46aa9b1b509227c3fec85f7594fc6acc5174120c6a6b9dc4bf51cf289","0x1163ec27e048e5495765b3d73da5d8f40c582722733dafad9a1cc24d0f16758b","0x68763e521f326223e1b25d71e1143b8e58b47d7e86aeb2b95dfc916dcfd7702c"]
