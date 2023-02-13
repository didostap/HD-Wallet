export const getRandomNumbers = (nums: number, start: number, end: number) => {
    const result = new Set<number>();
  
    while (result.size < nums) {
      const randomNumber = Math.floor(Math.random() * (end - start + 1)) + start;
  
      if (!result.has(randomNumber)) {
        result.add(randomNumber);
      }
    }
  
    return [...result];
  };