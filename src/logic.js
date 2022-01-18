const getData = async (src) => {
  const response = await fetch(src);
  const data = await response.json();
  return data;
};
export { getData };
