var comic_default = async (req, res) => {
  const num = Math.floor(Math.random() * 2990) + 1;
  const response = await fetch(`https://xkcd.com/${num}/info.0.json`);
  const comic = await response.json();
  res.json(comic);
};
export {
  comic_default as default
};
