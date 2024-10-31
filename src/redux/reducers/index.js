import { combineReducers } from "redux";
import tableWS from "./table";
import lobby from "./lobby";
import landing from "./landing";
import auth from "./auth";
import multiRoom from "./multiRoom";
import sitngoRoom from "./sitngoRoom";
import news from "./news";
import gameWs from "./gameWs";
import tableUsersList from "./tableUserList";
import profile from "./profile";
import market from "./market";
import messenger from "./messenger";
import inventory from "./inventory";
import acquiring from "./acquiring";
import tutorial from "./tutorial";

// awesome basic redux tutorial https://react-redux.js.org/introduction/basic-tutorial

export default combineReducers({ tableWS, lobby, landing, auth, multiRoom, sitngoRoom, news, gameWs,
  tableUsersList, profile, market, messenger, inventory, acquiring, tutorial});