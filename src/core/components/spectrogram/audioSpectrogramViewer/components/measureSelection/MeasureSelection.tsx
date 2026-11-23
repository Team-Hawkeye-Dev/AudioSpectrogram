import { useEffect, useRef, useState } from "react";
import type { Instance as PopperInstance } from "@popperjs/core";
import type { MeasureArea, MeasureBox } from "../../types";
import { MeasureStats } from "../measureStats/MeasureStats";
import { MeasureSelectionBox, MeasureTooltip } from "./MeasureSelection.styles";

interface MeasureSelectionProps {
  measureArea: MeasureArea;
  measureBox: MeasureBox;
  isMeasuring: boolean;
}

export const MeasureSelection = ({ measureArea, measureBox, isMeasuring }: MeasureSelectionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const popperRef = useRef<PopperInstance | null>(null);
  const isStatsOpen = isMeasuring || isHovered;

  useEffect(() => {
    popperRef.current?.update();
  }, [measureBox]);

  return (
    <MeasureTooltip
      title={<MeasureStats measureArea={measureArea} />}
      placement="top"
      arrow
      disableInteractive
      open={isStatsOpen}
      onOpen={() => setIsHovered(true)}
      onClose={() => setIsHovered(false)}
      slotProps={{ popper: { popperRef } }}
    >
      <MeasureSelectionBox
        style={{
          left: measureBox.left,
          top: measureBox.top,
          width: measureBox.width,
          height: measureBox.height,
        }}
      />
    </MeasureTooltip>
  );
};
