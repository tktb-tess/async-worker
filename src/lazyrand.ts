
const randF64 = (buff: SharedArrayBuffer) => {
  crypto.getRandomValues(new BigUint64Array(buff));
  return new Float64Array(buff)[0];
};

const sleep = async () => {
  return new Promise<void>((res) => setTimeout(res, 600));
}



export { randF64, sleep };
