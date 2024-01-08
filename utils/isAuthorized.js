import passport from "passport";

// Protect secure routes
const isAuthorized = async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        next();
      };
      
    } catch (err) {
      res.status(401).json({
        message: "Unauthorized" 
      });
    }
};

export { isAuthorized };