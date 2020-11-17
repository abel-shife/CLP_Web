const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const config = require("../config/config");

const adminConnection = require("../database/adminSchema");
const supperConnection = require("../database/supperAdminSchema");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.authentication.jwtSecret
    },
    async function(jwtPlayLoad, done) {
      try {
        var adminQuery = {
          id: jwtPlayLoad.id
        };
      if(jwtPlayLoad.actor=="supper"){
          await supperConnection.findOne(adminQuery, (err, admin) => {
          if (err) {
            return done(new Error(), false);
          }
          if (!admin) {
            return done(new Error(), false);
          }
          return done(null, admin);
        });
      } else if (jwtPlayLoad.actor == "branch") {
          await adminConnection.findOne(adminQuery, (err, admin) => {
          if (err) {
            return done(new Error(), false);
          }
          if (!admin) {
            return done(new Error(), false);
          }
          return done(null, admin);
        });
      }
      } catch (err) {
        return done(new Error(), false);
      }
    }
  )
);

module.exports = null;
