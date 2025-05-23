export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  //const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
  let cookieName = "userToken"; // fallback
  switch (user.role) {
    case "SuperAdmin":
      cookieName = "superAdminToken";
      break;
    case "Admin":
      cookieName = "adminToken";
      break;
    case "BloodBankAdmin":
      cookieName = "bloodBankAdminToken";
      break;
    case "Requester":
      cookieName = "requesterToken";
      break;
    case "Donor":
      cookieName = "donorToken";
      break;
    case "Hospital":
      cookieName = "hospitalToken";
      break;
    case "Organization":
      cookieName = "organizationToken";
      break;
    default:
      cookieName = "patientToken";
  }
  const { password, __v, ...safeUser } = user._doc || user;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    })
    .json({
      success: true,
      message,
      user: safeUser,
      token,
    });
};
