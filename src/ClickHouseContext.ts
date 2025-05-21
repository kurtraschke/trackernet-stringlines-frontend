import React, { createContext } from "react";
import { createClient } from "@clickhouse/client-web";
import type { WebClickHouseClient } from "@clickhouse/client-web/dist/client";

export const ClickHouseContext: React.Context<WebClickHouseClient> =
  createContext(createClient({}));
