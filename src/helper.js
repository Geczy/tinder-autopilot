const randomDelay = async () => {
  const rand = generateRandomNumber(350, 600);
  return new Promise(resolve => setTimeout(resolve, rand));
};

const generateRandomNumber = (min = 800, max = 1500) => {
  return Math.random() * (max - min) + min;
};

export { randomDelay, generateRandomNumber };
