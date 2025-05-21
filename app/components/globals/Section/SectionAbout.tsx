import Box from "../../ui/Box/Box";

type Props = {
  entry: any;
};

const SectionAbout = (props: Props) => {
  const { entry } = props;

  return (
    <Box className="section w-full h-full flex items-center justify-center">
      About
    </Box>
  );
};

export default SectionAbout;
