export const register = async (req, res) => {
  res.send("registrando");
  console.log(req.body);
};
export const login = async (req, res) => {
  res.send("login");
};
