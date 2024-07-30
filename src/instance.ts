import MimeTypes from "./mime-types";
import db from "mime-db";

const MTypes = new MimeTypes(db);
export default MTypes;
