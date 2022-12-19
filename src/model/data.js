const data = () => {
  return fetch("http://localhost:5000/ah2stagingwebservice/")
    .then((res) => res.json)
    .then((res) => {
      console.log(res);
    });
};

export default data;
