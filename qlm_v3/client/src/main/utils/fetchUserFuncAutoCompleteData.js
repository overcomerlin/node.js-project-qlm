export const fetchUserFuncAutoCompleteData = ({ allUserFuncFields }) => {
  const data = allUserFuncFields.reduce(
    (acc, curr) => {
      acc.username.push(curr.username);
      acc.functionality.push(curr.userInfo.functionality);
      return acc;
    },
    {
      username: [],
      functionality: [],
    }
  );
  return data;
};
