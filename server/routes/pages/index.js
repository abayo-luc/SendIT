import { Router } from "express";
import path from "path";
const pages = Router();
pages
  .get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../UI/pages/login.html"));
  })
  .get("/client", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../UI/pages/client.html"));
  })
  .get("/parcel", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../UI/pages/parcel.html"));
  })
  .get("/parcels/new", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../UI/pages/newparcel.html"));
  })
  .get("/parcels/in_transit", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../UI/pages/intransit.html"));
  })
  .get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../UI/pages/admin.html"));
  })
  .get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../UI/index.html"));
  })
  .get("/auth/password_recovery", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../../../UI/pages/password_recovery.html")
    );
  })
  .get("/auth/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../UI/pages/reset_password.html"));
  });
export default pages;
