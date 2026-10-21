import { FREQUENCY_STEP } from "../../consts";
import { FrequencyLabel, FrequencyLabelList, FrequencyLabelTrack } from "./FrequencyLabels.styles";

interface FrequencyLabelsProps {
    maxHz: number;
    stepHz: number;
}

const getLabelTopPercent = (frequencyHz: number, maxHz: number) => `${(1 - frequencyHz / maxHz) * 100}%`;

export const FrequencyLabels = ({ maxHz, stepHz }: FrequencyLabelsProps) => {
    const frequencyLabelsHz = Array.from(
        { length: maxHz / stepHz + 1 },
        (_, index) => maxHz - index * stepHz,
    );

    return (
        <FrequencyLabelList>
            <FrequencyLabelTrack>
                {frequencyLabelsHz.map((frequencyHz) => {
                    const kHz = frequencyHz / FREQUENCY_STEP;
                    return (
                        <FrequencyLabel key={frequencyHz} style={{ top: getLabelTopPercent(frequencyHz, maxHz) }}>
                            {`${kHz}k`}
                        </FrequencyLabel>
                    );
                })}
            </FrequencyLabelTrack>
        </FrequencyLabelList>
    );
};
