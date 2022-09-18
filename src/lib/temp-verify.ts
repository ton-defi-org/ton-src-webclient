import { Cell } from "ton";
import tweetnacl from "tweetnacl";

const b = Buffer.from(
  "te6cckEBBAEA0wAByy2FcIABW3IiTMiv6JntyJBHE6/GLzlwsQU4DEdOal0wYY5i0rVlJHSaNZTyTOGnz4gBfqGEKOmburzGihe0ZA5jJxH3gBZwyvpSJRa3ATlXY6zvO2NzfH9Jah8CZnpHW8ywu9j/8AEBWgAAAAEAAAAAAAAAAAD+tf9oIOL/DZSD5+DWLIF9hGeJ+0rlgMh4hm2VnavVwAIBAAMAamlwZnM6Ly9RbVBpRkZ2RVF4MllDbk1hUFFSS3NTem11YW1wYTh0Q3dBdjd4S05CbnJrTlNWa8ZOHA==",
  "base64"
);

const c = Cell.fromBoc(b)[0];

const s = c.beginParse();

const sig = s.readBuffer(64);

const signedMsg = s.toCell().hash();

const pk = Buffer.from(
  "lEWxhFVlUOmgmw6XDS+oCtV+BnX2h+fmSTQ7T7HrI3I=",
  "base64"
);

console.log({
  h: s.toCell().hash().toString(),
  sig: sig.toString(),
  v: tweetnacl.sign.detached.verify(signedMsg, sig, pk),
});

const readData = () => {
  const dataB = Buffer.from(
    "te6cckEBAQEAIgAAQJRFsYRVZVDpoJsOlw0vqArVfgZ19ofn5kk0O0+x6yNygowTQQ==",
    "base64"
  );

  const c = Cell.fromBoc(dataB)[0];

  console.log(c.beginParse().readBuffer(32).toString("base64"));
};

readData()
