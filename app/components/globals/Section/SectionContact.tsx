import Box from "../../ui/Box/Box";

type Props = {
  entry: any;
};

const SectionContact = (props: Props) => {
  const { entry } = props;
  return (
    <Box className="section w-full h-full flex items-center justify-center">
      Contact
    </Box>
  );
};

export default SectionContact;
