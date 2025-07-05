export const successRes = (resData: any, code = 200) => {
  return {
    statusCode: code,
    message: 'success',
    data: resData,
  };
};
