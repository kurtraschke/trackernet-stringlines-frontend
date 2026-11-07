import React from "react";
import { Label, Title, Tooltip } from "@patternfly/react-core";

interface DataQualityProps {
  status?: "success" | "warning" | "danger" | "info" | "custom";
  labelText?: string;
  headerContent?: React.ReactNode;
  bodyContent?: React.ReactNode;
}

const defaultStatus = "custom";
const defaultLabelText = "Data quality unknown";
const defaultHeaderContent = <div>Data quality unknown</div>;
const defaultBodyContent = (
  <div>
    The data quality for this chart configuration has not been evaluated. It may
    present incomplete or erroneous information.
  </div>
);

const DataQuality: React.FunctionComponent<DataQualityProps> = ({
  status = defaultStatus,
  labelText = defaultLabelText,
  headerContent = defaultHeaderContent,
  bodyContent = defaultBodyContent,
}) => {
  return (
    <Tooltip
      content={
        <>
          <Title headingLevel="h6">{headerContent}</Title>
          {bodyContent}
        </>
      }
    >
      <Label status={status}>{labelText}</Label>
    </Tooltip>
  );
};

export default DataQuality;
