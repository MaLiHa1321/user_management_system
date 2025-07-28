export const sortUsersByLastLoginDesc = (users) => {
  return [...users].sort((a, b) => {
    const aTime = new Date(a.lastLogin || 0).getTime();
    const bTime = new Date(b.lastLogin || 0).getTime();
    return bTime - aTime;
  });
};