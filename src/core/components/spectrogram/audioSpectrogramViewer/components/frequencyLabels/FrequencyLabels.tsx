import { FREQUENCY_LABEL_DECIMALS, FREQUENCY_STEP } from "../../consts";
import type { FrequencyView } from "../../types";
import { FrequencyLabel, FrequencyLabelList } from "./FrequencyLabels.styles";

interface FrequencyLabelsProps {
    maxHz: number;
    stepHz: number;
    frequencyView: FrequencyView;
}

export const FrequencyLabels = ({ maxHz, stepHz, frequencyView }: FrequencyLabelsProps) => {
    const labelCount = maxHz / stepHz + 1;
    const visibleSpanHz = frequencyView.maxHz - frequencyView.minHz;
    const labelStepHz = visibleSpanHz / (labelCount - 1);
    const frequencyLabelsHz = Array.from(
        { length: labelCount },
        (_, index) => frequencyView.maxHz - index * labelStepHz,
    );

    return (
        <FrequencyLabelList>
            {frequencyLabelsHz.map((frequencyHz, index) => {
                const kHz = Number((frequencyHz / FREQUENCY_STEP).toFixed(FREQUENCY_LABEL_DECIMALS));
                return (
                    <FrequencyLabel key={index}>
                        {`${kHz}k`}
                    </FrequencyLabel>
                );
            })}
        </FrequencyLabelList>
    );
};
