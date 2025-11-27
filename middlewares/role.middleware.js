exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    console.log("🔐 [RoleCheck] Required roles:", roles);
    console.log("👤 Current user role:", req.user?.role);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user information found!",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You don't have required permissions!",
      });
    }

    console.log("✅ Role authorized:", req.user.role);

    next();
  };
};
