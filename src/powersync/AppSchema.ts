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
    created_at: column.text,
    name: column.text,
    avatar: column.text,
  },
  { indexes: {} },
);

const user_categories = new Table(
  {
    // id column (text) is automatically included
    user_id: column.text,
    name: column.text,
    icon: column.text,
    sort_order: column.integer,
    is_deleted: column.integer,
    template_id: column.text,
    has_overrides: column.integer,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

const user_subcategories = new Table(
  {
    // id column (text) is automatically included
    user_id: column.text,
    parent_id: column.text,
    name: column.text,
    icon: column.text,
    sort_order: column.integer,
    is_deleted: column.integer,
    template_id: column.text,
    has_overrides: column.integer,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

const user_expenses = new Table(
  {
    // id column (text) is automatically included
    user_id: column.text,
    subcategory_id: column.text,
    amount: column.text,
    currency: column.text,
    occurred_at: column.text,
    note: column.text,
    receipt_url: column.text,
    is_deleted: column.integer,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

const user_tags = new Table(
  {
    // id column (text) is automatically included
    user_id: column.text,
    name: column.text,
    is_deleted: column.integer,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

const user_expense_tags = new Table(
  {
    // id column (text) is automatically included
    user_id: column.text,
    expense_id: column.text,
    tag_id: column.text,
    is_deleted: column.integer,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

const groups = new Table(
  {
    // id column (text) is automatically included
    created_at: column.text,
    title: column.text,
    icon: column.text,
    currency: column.text,
    is_deleted: column.integer,
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
    updated_at: column.text,
    is_archived: column.integer,
  },
  { indexes: {} },
);

const category_templates = new Table(
  {
    // id column (text) is automatically included
    template_id: column.text,
    scope: column.text,
    slug: column.text,
    name: column.text,
    icon: column.text,
    sort_rank: column.text,
    version: column.integer,
    is_active: column.integer,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

const subcategory_templates = new Table(
  {
    // id column (text) is automatically included
    template_id: column.text,
    parent_template_id: column.text,
    scope: column.text,
    slug: column.text,
    name: column.text,
    icon: column.text,
    sort_rank: column.text,
    version: column.integer,
    is_active: column.integer,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

export const AppSchema = new Schema({
  profiles,
  user_categories,
  user_subcategories,
  user_expenses,
  user_tags,
  user_expense_tags,
  groups,
  group_members,
  category_templates,
  subcategory_templates,
});

export type Database = (typeof AppSchema)["types"];
