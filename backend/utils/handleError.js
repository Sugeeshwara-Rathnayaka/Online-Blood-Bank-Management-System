// export function handleError(error) {
//   console.error(error);

//   if (error.code === 11000) {
//     const field = Object.keys(error.keyPattern)[0];
//     const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
//     return {
//       statusCode: 409,
//       success: false,
//       message: `${formattedField} already exists`,
//     };
//   }

//   if (error.name === "ValidationError") {
//     const messages = Object.values(error.errors).map((val) => val.message);
//     return {
//       statusCode: 400,
//       success: false,
//       message: "Validation failed",
//       errors: messages,
//     };
//   }

//   return {
//     statusCode: 500,
//     success: false,
//     message: "Server error",
//     error: process.env.NODE_ENV === "development" ? error.message : undefined,
//   };
// }
