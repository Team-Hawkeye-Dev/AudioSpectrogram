import { FREQUENCY_STEP } from "../../consts";
import { FrequencyLabel, FrequencyLabelList } from "./FrequencyLabels.styles";

interface FrequencyLabelsProps {
    maxHz: number;
    stepHz: number;
}

export const FrequencyLabels = ({ maxHz, stepHz }: FrequencyLabelsProps) => {
    const frequencyLabelsHz = Array.from(
        { length: maxHz / stepHz + 1 },
        (_, index) => maxHz - index * stepHz,
    );

    return (
        <FrequencyLabelList>
            {frequencyLabelsHz.map((frequencyHz) => {
                const hz = frequencyHz / FREQUENCY_STEP;
                return (
                    <FrequencyLabel key={frequencyHz}>
                        {`${hz}k`}
                    </FrequencyLabel>
                );
            })}
        </FrequencyLabelList>
    );
};
