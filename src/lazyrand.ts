
const randF64 = (buff: SharedArrayBuffer) => {
  crypto.getRandomValues(new BigUint64Array(buff));
  return new Float64Array(buff)[0];
};

const sleep = async (delay: number = 500) => {
  return new Promise<void>((res) => setTimeout(res, delay));
}



export { randF64, sleep };
