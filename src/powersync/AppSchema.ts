// Platform-specific PowerSync imports
import { Platform } from "react-native";
let column: any, Schema: any, Table: any;
if (Platform.OS === "web") {
  ({ column, Schema, Table } = require("@powersync/web"));
} else {
  ({ column, Schema, Table } = require("@powersync/react-native"));
}

const profiles = new Table(
  {
    // id column (text) is automatically included
    user_id: column.text,
    name: column.text,
    avatar: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

const groups = new Table(
  {
    // id column (text) is automatically included
    title: column.text,
    icon: column.text,
    currency: column.text,
    is_deleted: column.integer,
    invite_token: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

const group_members = new Table(
  {
    // id column (text) is automatically included
    group_id: column.text,
    user_id: column.text,
    display_name: column.text,
    is_archived: column.integer,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

export const AppSchema = new Schema({
  profiles,
  groups,
  group_members,
});

export type Database = (typeof AppSchema)["types"];
