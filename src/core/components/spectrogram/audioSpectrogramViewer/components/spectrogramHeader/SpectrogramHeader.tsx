import { SpectrogramHeaderTitle } from "./SpectrogramHeader.styles";

interface SpectrogramHeaderProps {
    title: string;
}

export const SpectrogramHeader = ({ title }: SpectrogramHeaderProps) => (
    <SpectrogramHeaderTitle variant="subtitle2">{title}</SpectrogramHeaderTitle>
);
