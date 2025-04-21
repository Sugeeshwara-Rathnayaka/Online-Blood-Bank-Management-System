export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  //const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
  let cookieName = "userToken"; // fallback
  if (user.role === "SuperAdmin") cookieName = "superAdminToken";
  else if (user.role === "Admin") cookieName = "adminToken";
  else if (user.role === "BloodBankAdmin") cookieName = "bloodBankAdminToken";
  else if (user.role === "Requester") cookieName = "requesterToken";
  else if (user.role === "Donor") cookieName = "donorToken";
  else if (user.role === "Hospital") cookieName = "hospitalToken";
  else if (user.role === "Organization") cookieName = "organizationToken";
  else cookieName = "patientToken";
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
