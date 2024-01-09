export default async function validatedToken() {
   try {
      const tokenInfo = await asyncReadFile(`${INFOS_FOLDER}genesysToken`, "json");
      if (tokenInfo === false) return false;

      // use "let" here
      let { access_token, createAt } = tokenInfo;

      const newToken = await generateToken();

      // new syntax:
      ({ access_token } = newToken);
   } catch (err) {
      LOGGER.error(`validatedToken Func ${err}`);
      return false;
   }
}
