import Box from "../../ui/Box/Box";

type Props = {
  entry: any;
};

const SectionIntro = (props: Props) => {
  const { entry } = props;
  return <Box className="section">Intro</Box>;
};

export default SectionIntro;
