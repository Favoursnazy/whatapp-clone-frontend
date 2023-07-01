export const getConversationId = (user, users) => {
  return users[0]._id === user.id ? users[1]._id : users[0]._id;
};

export const getUserProfilePicture = (user, users) => {
  return users[0]._id === user.id ? users[1].picture : users[0].picture;
};

export const getChatUsername = (user, users) => {
  return users[0]._id === user.id ? users[1].name : users[0].name;
};

export const checkOnlineStatus = (onlineUsers, user, users) => {
  let convoId = getConversationId(user, users);
  let check = onlineUsers.find((u) => u.userId === convoId);
  return check ? true : false;
};
