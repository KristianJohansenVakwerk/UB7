import Box from "../../ui/Box/Box";

type Props = {
  entry: any;
};

const SectionIntro = (props: Props) => {
  const { entry } = props;
  return (
    <Box className="section w-full h-full relative gradient-background">
      <div className={"clip-path-container "}>
        <span className={"clip-path"}></span>
      </div>
    </Box>
  );
};

export default SectionIntro;
